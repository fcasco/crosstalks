var crosstalks = crosstalks || {'sessions': []};


function create_talk(evt) {
    // Create a new talk for a session
    evt.preventDefault();

    const talk_form = evt.target.form;
    const talk_name = talk_form.querySelector('[name="talk_name"]').value;
    const talk_speaker = talk_form.querySelector('[name="talk_speaker"]').value;
    const talk_url = talk_form.querySelector('[name="talk_url"]').value;
    const talk_duration = talk_form.querySelector('[name="talk_duration"]').value;
    console.log(talk_name);

}


function create_session(evt) {
    // Create a new session of talks
    evt.preventDefault();

    const new_session = {};
    const session_template = document.querySelector('.session.template');
    new_session.form = evt.target.form;
    new_session.name = new_session.form.querySelector('[name="session_name"]').value;
    new_session.talks_duration = new_session.form.querySelector('[name="talks_duration"]').value;
    new_session.start = new_session.form.querySelector('[name="session_start"]').value;

    new_session.tag = session_template.cloneNode(true);
    new_session.tag.querySelector('[action="/talk/new"] [type="submit"]')
        .addEventListener('click', create_talk);

    new_session.tag.querySelector('.name').innerHTML = new_session.name;
    new_session.tag.querySelector('.talks_duration').innerHTML = new_session.talks_duration;
    new_session.tag.classList.remove('template');

    document.body.appendChild(new_session.tag);

    crosstalks.sessions.push(new_session);
}


const new_session_btn = document.querySelector('[action="/session/new"] [type="submit"]');

new_session_btn.addEventListener('click', create_session);
