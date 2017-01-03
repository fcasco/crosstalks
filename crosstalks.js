crosstalks = (function main() {
    "use strict";

    let crosstalks = {};


    function reset_talk_form(talk_form) {
        // Clear the values in the talk form

        const talks_count = crosstalks.session.tag.querySelector('ol.talks').childElementCount;

        talk_form.querySelector('[name="talk_speaker"]').value = '';
        talk_form.querySelector('[name="talk_name"]').value = '';
        talk_form.querySelector('[name="talk_url"]').value = '';
        talk_form.querySelector('[name="talk_duration"]').value = crosstalks.session.talks_duration;
        talk_form.querySelector('[name="talk_position"]').value = talks_count;

        talk_form.querySelector('[name="talk_speaker"]').focus();
    }


    function remove_talk(evt) {
        // Removes the talk from the session
        const talk_tag = evt.target.parentElement;
        const talk_name = talk_tag.querySelector('.talk_name').innerHTML;
        const talk_speaker = talk_tag.querySelector('.talk_speaker').innerHTML;

        talk_tag.remove();

        crosstalks.session.talks = crosstalks.session.talks.filter(function (x) {
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

        crosstalks.session.tag.querySelector('ol.talks').appendChild(talk.tag);

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
        new_talk.position = new_talk.form.querySelector('[name="talk_position"]').value;

        add_talk_tag(new_talk, new_talk.position, crosstalks.session.talks);

        crosstalks.session.talks.push(new_talk);

        reset_talk_form(crosstalks.session.tag.querySelector('[action="/talk/new"]'));
    }


    function sort_talks(evt) {
        // Sorts the talks by given criteria
        const sort_form = evt.target.parentElement;
        const session_tag = sort_form.parentElement;
        const sort_criteria = sort_form.querySelector('[name="sort_by"]').value;
        const comp_fns = {
            '-': function (a, b) { return 0; },
            'name': function (a, b) { return a.name > b.name ? 1 : -1; },
            'speaker': function (a, b) { return a.speaker > b.speaker ? 1 : -1; },
            'duration': function (a, b) { return parseInt(a.duration, 10) > parseInt(b.duration, 10) ? 1 : -1; },
            'random': function (a, b) { return Math.random() > 0.5 ? 1 : -1; }
        }

        evt.preventDefault();

        session_tag.querySelectorAll('ol.talks li').forEach(function (e) { e.remove(); });

        crosstalks.session.talks = crosstalks.session.talks.sort(comp_fns[sort_criteria]);

        crosstalks.session.talks.forEach(add_talk_tag);
    }


    function create_session(evt) {
        // Create a new session of talks
        evt.preventDefault();

        const new_session_form = document.querySelector('[action="/session/new"]');
        const new_session = {'talks': []};
        const session_template = document.querySelector('.session.template');

        new_session.form = evt.target.form;
        new_session.name = new_session.form.querySelector('[name="session_name"]').value;
        new_session.talks_duration = new_session.form.querySelector('[name="talks_duration"]').value || 0;

        new_session.tag = session_template.cloneNode(true);
        new_session.tag.querySelector('[action="/talk/new"] [type="submit"]')
            .addEventListener('click', create_talk);

        new_session.tag.querySelector('.name').innerHTML = new_session.name;
        new_session.tag.querySelector('.talks_duration').innerHTML = new_session.talks_duration;
        new_session.tag.classList.remove('template');

        new_session.tag.querySelector('[action="/session/sort"] [type="submit"]')
                      .addEventListener('click', sort_talks);

        new_session_form.parentNode.insertBefore(new_session.tag, new_session_form.nextSibling);
        new_session_form.classList.add('collapsed');
        // document.body.appendChild(new_session.tag);

        new_session.tag.querySelector('[name="talk_name"]').focus();

        crosstalks.session = new_session;

        reset_talk_form(new_session.tag.querySelector('[action="/talk/new"]'));

        //document.querySelector('[action="/session/new"]').classList.add('collapsed');

    }


    const new_session_btn = document.querySelector('[action="/session/new"] [type="submit"]');

    new_session_btn.addEventListener('click', create_session);

    document.querySelector('[name="session_name"]').focus();

    return crosstalks;
})();
