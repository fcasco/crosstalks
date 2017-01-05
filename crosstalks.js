crosstalks = (function main() {
    "use strict";

    let crosstalks = {'talks': []};


    function reset_talk_form(talk_form) {
        // Clear the values in the talk form

        talk_form.querySelector('[name="talk_speaker"]').value = '';
        talk_form.querySelector('[name="talk_name"]').value = '';
        talk_form.querySelector('[name="talk_url"]').value = '';
        talk_form.querySelector('[name="talk_duration"]').value = crosstalks.talks[crosstalks.talks.length - 1].duration;

        talk_form.querySelector('[name="talk_speaker"]').focus();
    }


    function remove_talk(evt) {
        // Removes the talk from the session
        const talk_tag = evt.target.parentElement;
        const talk_name = talk_tag.querySelector('.talk_name').innerHTML;
        const talk_speaker = talk_tag.querySelector('.talk_speaker').innerHTML;

        talk_tag.remove();

        crosstalks.talks = crosstalks.talks.filter(function (x) {
            return ! (x.name === talk_name && x.speaker === talk_speaker);
        });
    }


    function add_talk_tag(talk, index, all_talks) {
        // Adds the tag associated with the talk to the DOM
        const talk_template = document.querySelector('.talk.template');

        talk.position = index;
        talk.tag = talk_template.cloneNode(true);
        talk.tag.querySelector('.talk_speaker').innerHTML = talk.speaker;
        talk.tag.querySelector('.talk_name').innerHTML = talk.name;
        talk.tag.querySelector('.talk_name').href = talk.url;
        talk.tag.querySelector('.talk_duration').innerHTML = talk.duration;
        talk.tag.querySelector('button.remove').addEventListener('click', remove_talk);
        talk.tag.classList.remove('template');

        document.querySelector('.talks ol').appendChild(talk.tag);

        return talk;
    }


    function create_talk(evt) {
        // Create a new talk for a session
        evt.preventDefault();

        const new_talk = {};

        new_talk.form = evt.target.form;
        new_talk.speaker = new_talk.form.querySelector('[name="talk_speaker"]').value;
        new_talk.name = new_talk.form.querySelector('[name="talk_name"]').value;
        new_talk.url = new_talk.form.querySelector('[name="talk_url"]').value;
        new_talk.duration = new_talk.form.querySelector('[name="talk_duration"]').value;

        add_talk_tag(new_talk, crosstalks.talks.length, crosstalks.talks);

        crosstalks.talks.push(new_talk);

        reset_talk_form(document.querySelector('[action="/talk/new"]'));
    }


    function sort_talks(evt) {
        // Sorts the talks by given criteria
        const sort_form = evt.target.parentElement;
        const sort_criteria = sort_form.querySelector('[name="sort_by"]').value;
        console.log('sorting by...' + sort_criteria);
        const comp_fns = {
            '-': function (a, b) { return 0; },
            'name': function (a, b) { return a.name > b.name ? 1 : -1; },
            'speaker': function (a, b) { return a.speaker > b.speaker ? 1 : -1; },
            'duration': function (a, b) { return parseInt(a.duration, 10) > parseInt(b.duration, 10) ? 1 : -1; },
            'random': function (a, b) { return Math.random() > 0.5 ? 1 : -1; }
        }

        evt.preventDefault();

        document.querySelectorAll('.talks ol li').forEach(function (e) {
            if (!e.classList.contains('template')) {
                e.remove();
            }
        });

        crosstalks.talks = crosstalks.talks.sort(comp_fns[sort_criteria]);

        crosstalks.talks.forEach(add_talk_tag);
    }


    function update_timer(evt) {
        // Update the timer of the current talk
        const ellapsed_seconds = (Date.now() - crosstalks.current_talk.start_time) / 1000;
        const seconds_left = Math.abs(crosstalks.current_talk.duration * 60 - ellapsed_seconds);
        const minutes = Math.floor(seconds_left / 60);
        const seconds = Math.floor(seconds_left - minutes * 60);
        const minutes_str = minutes < 10 ? '0' + minutes.toFixed() : minutes.toFixed();
        const seconds_str = seconds < 10 ? '0' + seconds.toFixed() : seconds.toFixed();

        crosstalks.current_talk.tag.querySelector('.timer_value').innerHTML = `${minutes_str}:${seconds_str}`;

        if (seconds_left < 60 * 5 && !crosstalks.current_talk.tag.classList.contains('warning')) {
            crosstalks.current_talk.tag.classList.add('warning');
        }

        if (crosstalks.current_talk.duration * 60 - ellapsed_seconds < 0) {

            if (!crosstalks.current_talk.tag.classList.contains('overtime')) {
                crosstalks.current_talk.tag.classList.add('overtime');
            }

            if (crosstalks.current_talk.tag.classList.contains('warning')) {
                crosstalks.current_talk.tag.classList.remove('warning');
            }
        }

        crosstalks.current_talk.timer = window.setTimeout(update_timer, 500);
    }


    function talk_start(evt) {
        // Start the current talk timer
        evt.preventDefault();
        crosstalks.current_talk.start_time = Date.now();

        evt.target.classList.add('hidden');

        crosstalks.current_talk.tag.querySelector('[action="/talk/stop"]').classList.remove('hidden');
        crosstalks.current_talk.tag.querySelector('[action="/talk/next"]').classList.remove('hidden');

        crosstalks.current_talk.timer = window.setTimeout(update_timer, 500);
    }


    function talk_stop(evt) {
        // Stops the current talk timer
        evt.preventDefault();
        window.clearTimeout(crosstalks.current_talk.timer)
    }


    function talk_next(evt) {
        // Set the next talk as the current talk
        evt.preventDefault();

    }


    function session_start(evt) {
        // Starts the first talk in the session
        const current_talk_template = document.querySelector('.current_talk.template');
        const current_talk_tag = current_talk_template.cloneNode(true);
        const current_talk = crosstalks.talks[0];

        evt.preventDefault();

        current_talk_tag.querySelector('.talk_name').innerHTML = current_talk.name;
        current_talk_tag.querySelector('.speaker_name').innerHTML = current_talk.speaker;
        current_talk_tag.querySelector('.timer_value').innerHTML = `${current_talk.duration}:00`;
        current_talk_tag.classList.remove('template');

        document.querySelector('body').insertBefore(current_talk_tag, document.querySelector('.talks'));

        current_talk.tag = current_talk_tag;

        crosstalks.current_talk = current_talk;

        current_talk_tag.querySelector('[action="/talk/play"] [type="submit"]').addEventListener('click', talk_start);
        current_talk_tag.querySelector('[action="/talk/stop"] [type="submit"]').addEventListener('click', talk_stop);
        current_talk_tag.querySelector('[action="/talk/next"] [type="submit"]').addEventListener('click', talk_next);
        current_talk_tag.querySelector('[action="/talk/play"] [type="submit"]').focus();

        return current_talk_tag;
    }

    function main() {
        document.querySelector('[action="/talk/new"] [type="submit"]').addEventListener('click', create_talk);
        document.querySelector('[action="/talks/sort"] [type="submit"]').addEventListener('click', sort_talks);
        document.querySelector('[action="/talks/sort"] [name="sort_by"]').addEventListener('change', sort_talks);
        document.querySelector('[action="/talks/start"] [type="submit"]').addEventListener('click', session_start);

        document.querySelector('[name="talk_speaker"]').focus();

        return crosstalks;
    }

    main();
})();
