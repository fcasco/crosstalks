var crosstalks = crosstalks || {};


function reset_talk_form(talk_form) {
    // Clear the values in the talk form

    const talks_count = crosstalks.session.tag.querySelector('ol.talks').childElementCount;

    talk_form.querySelector('[name="talk_name"]').value = '';
    talk_form.querySelector('[name="talk_speaker"]').value = '';
    talk_form.querySelector('[name="talk_url"]').value = '';
    talk_form.querySelector('[name="talk_duration"]').value = crosstalks.session.talks_duration;
    talk_form.querySelector('[name="talk_position"]').value = talks_count;

    talk_form.querySelector('[name="talk_name"]').focus();
}


function create_talk(evt) {
    // Create a new talk for a session
    evt.preventDefault();

    const new_talk = {};
    const talk_template = document.querySelector('.talk.template');

    new_talk.form = evt.target.form;
    new_talk.name = new_talk.form.querySelector('[name="talk_name"]').value;
    new_talk.speaker = new_talk.form.querySelector('[name="talk_speaker"]').value;
    new_talk.url = new_talk.form.querySelector('[name="talk_url"]').value;
    new_talk.duration = new_talk.form.querySelector('[name="talk_duration"]').value;
    new_talk.position = new_talk.form.querySelector('[name="talk_position"]').value;

    new_talk.tag = talk_template.cloneNode(true);
    new_talk.tag.querySelector('.talk_name').innerHTML = new_talk.name;
    new_talk.tag.querySelector('.talk_speaker').innerHTML = new_talk.speaker;
    new_talk.tag.querySelector('.talk_duration').innerHTML = new_talk.duration;
    new_talk.tag.classList.remove('template');

    crosstalks.session.tag.querySelector('ol.talks').appendChild(new_talk.tag);

    crosstalks.session.talks.push(new_talk);

    reset_talk_form(crosstalks.session.tag.querySelector('[action="/talk/new"]'));
    crosstalks.session.tag.querySelector('[name="talk_name"]').focus();
}


function create_session(evt) {
    // Create a new session of talks
    evt.preventDefault();

    const new_session = {'talks': []};
    const session_template = document.querySelector('.session.template');
    new_session.form = evt.target.form;
    new_session.name = new_session.form.querySelector('[name="session_name"]').value;
    new_session.talks_duration = new_session.form.querySelector('[name="talks_duration"]').value || 0;
    new_session.start = new_session.form.querySelector('[name="session_start"]').value;

    new_session.tag = session_template.cloneNode(true);
    new_session.tag.querySelector('[action="/talk/new"] [type="submit"]')
        .addEventListener('click', create_talk);

    new_session.tag.querySelector('.name').innerHTML = new_session.name;
    new_session.tag.querySelector('.talks_duration').innerHTML = new_session.talks_duration;
    new_session.tag.classList.remove('template');

    document.body.appendChild(new_session.tag);

    new_session.tag.querySelector('[name="talk_name"]').focus();

    crosstalks.session = new_session;

    reset_talk_form(new_session.tag.querySelector('[action="/talk/new"]'));

    document.querySelector('[action="/session/new"]').classList.add('collapsed');
}


const new_session_btn = document.querySelector('[action="/session/new"] [type="submit"]');

new_session_btn.addEventListener('click', create_session);

document.querySelector('[name="session_name"]').focus();
