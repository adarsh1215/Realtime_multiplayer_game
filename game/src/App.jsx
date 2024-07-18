import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Home from './components/home/Home'
import get_supabase from './supabase'
import { useWorld } from './World/useWorld'

function App() {
	
	const world = useWorld();
	const supabase = get_supabase();

	const [session, set_session] = useState(null);
	const [user_info, set_user_info] = useState({name: ""});
	const [match_making, set_match_making] = useState(false);
	const [connected, set_connected] = useState(false);
	const [in_game, set_in_game] = useState(false);
	const app_ref = useRef(null);

	const set_in_game_callback = (state) => {
		set_in_game(state);
	}

	const on_auth_state_change = async (new_session) => {
		set_session(prev => new_session);
		// console.log(new_session);
		const info = await world.authenticate(new_session.access_token);
		set_user_info(prev => info);
		// console.log(info);
	}

	const find_match = async () => {
		await world.find_match();
		set_match_making(false);
	}

	useEffect(() => {
		if(connected) return;
		console.log("useEffect");
		const connect = async () => {

			// const data = await supabase.auth.getSession();
			const data = {data : {session : null}};

			if(data.data.session) {
				set_session(prev => data.data.session);
				console.log(session);
			}
			if(connected) return;
			const info = await world.init(set_in_game_callback, data.data.session ? data.data.session.access_token : null);
			set_user_info(prev => info);
			set_connected(prev => true);
		}
		connect();
	}, []);

    useEffect(() => {
		
		if(in_game) {
			world.render_to(app_ref.current);
			world.start()
		} else if(world.in_game) {
			world.stop();
		}

	}, [in_game]);

  	return (
    <>
		<div id = "app" ref={app_ref}>
      		{!in_game && <Home find_match={find_match} user_info = {user_info} session = {session} set_session = {on_auth_state_change} />}
		</div>
    </>
  )
}

export default App
