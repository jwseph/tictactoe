import { useState, useEffect } from 'react'
import './App.css'
import { GoGlobe, GoPeople, GoSmiley, GoSun, GoMoon }from 'react-icons/go'
import { Route, Link, Routes } from 'react-router-dom'
import { socket } from './socket'

const classNames = (...classes) => classes.filter(Boolean).join(' ');

const WIN_STATES = [
  0b100100100,
  0b010010010,
  0b001001001,
  0b111000000,
  0b000111000,
  0b000000111,
  0b100010001,
  0b001010100,
]

function O() {
  return (
    <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
      <circle cx='50' cy='50' r='46' fill='none' stroke='currentColor' strokeWidth='8'/>
    </svg>
  )
}

function X() {
  return (
    <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
      <line x1='8' y1='8' x2='92' y2='92' stroke='currentColor' strokeWidth='8'/>
      <line x1='92' y1='8' x2='8' y2='92' stroke='currentColor' strokeWidth='8'/>
    </svg>
  )
}

function getWinState(state) {
  for (const winState of WIN_STATES) {
    if ((state>>9&winState) != winState) continue;
    let taken = state&winState;
    if (taken == 0 || taken == winState) return winState;
  }
  return 0;
}

function getWinner(state) {
  for (const winState of WIN_STATES) {
    if ((state>>9&winState) != winState) continue;
    let taken = state&winState;
    if (taken == 0) return 0;
    if (taken == winState) return 1;
  }
  return -1;
}

function solve(state) {
  // Returns -1 (X win), 0 (tie), or 1 (O win), assuming O goes first
  for (const winState of WIN_STATES) {
    if ((state>>9&winState) != winState) continue;
    let taken = state&winState;
    if (taken == 0) return 1;
    if (taken == winState) return -1;
  }
  if ((state>>9&(1<<9)-1) == (1<<9)-1) return 0;
  let res = -Infinity;
  for (let i = 0; i < 9; ++i) {
    if (state&1<<9+i) continue;
    let newState = state|1<<9+i;
    res = Math.max(res, -solve(newState^newState>>9));
  }
  return res;
}

function getOptimalMove(state) {
  let res = -Infinity, idx = [];
  for (let i = 0; i < 9; ++i) {
    if (state&1<<9+i) continue;
    let newState = state|1<<9+i;
    let s = -solve(newState^newState>>9);
    if (s < res) continue;
    if (s > res) {
      res = s;
      idx = [];
    }
    idx.push(i)
  }
  return idx;
}

function Mark({type, hidden, transparent}) {
  useEffect(() => {
    console.log('mark', type, hidden, transparent);
  }, [])
  useEffect(() => {
    console.log('transparency changed')
  }, [transparent])
  return type == 0 ? (
    <div className={classNames(
      'w-full h-full text-center p-5',
      transparent ? 'become-transparent' : hidden ? 'text-zinc-100 dark:text-zinc-900 opacity-0 hover:opacity-100 cursor-pointer' : 'place opacity-100',
    )}>
      <O/>
    </div>
  ) : type == 1 ? (
    <div className={classNames(
      'w-full h-full flex justify-center items-center p-5',
      transparent ? 'become-transparent' : hidden ? 'text-zinc-100 dark:text-zinc-900 opacity-0 hover:opacity-100 cursor-pointer' : 'place opacity-100',
    )}>
      <X/>
    </div>
  ) : (
    <div className='w-full h-full'></div>
  );
}

function Board({gameState, winningState, player, onClick, onFinishedClick, disabled}) {
  return (
    <div className={classNames('fade-in', winningState && 'cursor-pointer')}>
      <div className='w-full aspect-square flex flex-col' onClick={() => {
        if (winningState) onFinishedClick();
      }}>
        <div className='flex-1 w-full flex'>
          <div className='flex-1 h-full'>
            {gameState>>9&1
              ? <Mark type={gameState&1} transparent={winningState && !(winningState&1)}/>
              : !disabled && !winningState && <div className='w-full h-full cursor-pointer' onClick={() => onClick(0)}><Mark type={player} hidden/></div>
            }
          </div>
          <div className='w-[5px] bg-zinc-300 dark:bg-zinc-700 duration-300 ease-in-out'></div>
          <div className='flex-1 h-full'>
            {gameState>>9+1&1
              ? <Mark type={gameState>>1&1} transparent={winningState && !(winningState>>1&1)}/>
              : !disabled && !winningState  && <div className='w-full h-full cursor-pointer' onClick={() => onClick(1)}><Mark type={player} hidden/></div>
            }
          </div>
          <div className='w-[5px] bg-zinc-300 dark:bg-zinc-700 duration-300 ease-in-out'></div>
          <div className='flex-1 h-full'>
            {gameState>>9+2&1
              ? <Mark type={gameState>>2&1} transparent={winningState && !(winningState>>2&1)}/>
              : !disabled && !winningState  && <div className='w-full h-full cursor-pointer' onClick={() => onClick(2)}><Mark type={player} hidden/></div>
            }
          </div>
        </div>
        <div className='h-[5px] bg-zinc-300 dark:bg-zinc-700 duration-300 ease-in-out'></div>
        <div className='flex-1 w-full flex'>
          <div className='flex-1 h-full'>
            {gameState>>9+3&1
              ? <Mark type={gameState>>3&1} transparent={winningState && !(winningState>>3&1)}/>
              : !disabled && !winningState  && <div className='w-full h-full cursor-pointer' onClick={() => onClick(3)}><Mark type={player} hidden/></div>
            }
          </div>
          <div className='w-[5px] bg-zinc-300 dark:bg-zinc-700 duration-300 ease-in-out'></div>
          <div className='flex-1 h-full'>
            {gameState>>9+4&1
              ? <Mark type={gameState>>4&1} transparent={winningState && !(winningState>>4&1)}/>
              : !disabled && !winningState  && <div className='w-full h-full cursor-pointer' onClick={() => onClick(4)}><Mark type={player} hidden/></div>
            }
          </div>
          <div className='w-[5px] bg-zinc-300 dark:bg-zinc-700 duration-300 ease-in-out'></div>
          <div className='flex-1 h-full'>
            {gameState>>9+5&1
              ? <Mark type={gameState>>5&1} transparent={winningState && !(winningState>>5&1)}/>
              : !disabled && !winningState  && <div className='w-full h-full cursor-pointer' onClick={() => onClick(5)}><Mark type={player} hidden/></div>
            }
          </div>
        </div>
        <div className='h-[5px] bg-zinc-300 dark:bg-zinc-700 duration-300 ease-in-out'></div>
        <div className='flex-1 w-full flex'>
          <div className='flex-1 h-full'>
            {gameState>>9+6&1
              ? <Mark type={gameState>>6&1} transparent={winningState && !(winningState>>6&1)}/>
              : !disabled && !winningState  && <div className='w-full h-full cursor-pointer' onClick={() => onClick(6)}><Mark type={player} hidden/></div>
            }
          </div>
          <div className='w-[5px] bg-zinc-300 dark:bg-zinc-700 duration-300 ease-in-out'></div>
          <div className='flex-1 h-full'>
            {gameState>>9+7&1
              ? <Mark type={gameState>>7&1} transparent={winningState && !(winningState>>7&1)}/>
              : !disabled && !winningState  && <div className='w-full h-full cursor-pointer' onClick={() => onClick(7)}><Mark type={player} hidden/></div>
            }
          </div>
          <div className='w-[5px] bg-zinc-300 dark:bg-zinc-700 duration-300 ease-in-out'></div>
          <div className='flex-1 h-full'>
            {gameState>>9+8&1
              ? <Mark type={gameState>>8&1} transparent={winningState && !(winningState>>8&1)}/>
              : !disabled && !winningState  && <div className='w-full h-full cursor-pointer' onClick={() => onClick(8)}><Mark type={player} hidden/></div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

function SelectModePage() {
  return (
    <>
      <div className='fade-in flex flex-col gap-2'>
        <Link to='/online' className='group w-full px-5 py-4 sm:rounded-lg flex items-center hover:bg-zinc-200/40 dark:hover:bg-zinc-900/75 duration-300 ease-in-out gap-5'>
          <GoGlobe className='w-10 h-10 text-zinc-300 group-hover:text-zinc-500 dark:text-zinc-700 dark:group-hover:text-zinc-500 duration-300 ease-in-out'/>
          <div className='flex-1 font-medium'>
            <h3 className='text-left text-zinc-400 group-hover:text-zinc-800 dark:text-zinc-500 dark:group-hover:text-zinc-50 text-lg duration-300 ease-in-out'>Online</h3>
            <p className='text-left text-zinc-300 group-hover:text-zinc-500 dark:text-zinc-700 dark:group-hover:text-zinc-500 text-sm duration-300 ease-in-out'>Play against an online opponent</p>
          </div>
        </Link>
        <Link to='/local' className='group w-full px-5 py-4 sm:rounded-lg flex items-center hover:bg-zinc-200/40 dark:hover:bg-zinc-900/75 duration-300 ease-in-out gap-5'>
          <GoPeople className='w-10 h-10 text-zinc-300 group-hover:text-zinc-500 dark:text-zinc-700 dark:group-hover:text-zinc-500 duration-300 ease-in-out'/>
          <div className='flex-1 font-medium'>
            <h3 className='text-left text-zinc-400 group-hover:text-zinc-800 dark:text-zinc-500 dark:group-hover:text-zinc-50 text-lg duration-300 ease-in-out'>Local</h3>
            <p className='text-left text-zinc-300 group-hover:text-zinc-500 dark:text-zinc-700 dark:group-hover:text-zinc-500 text-sm duration-300 ease-in-out'>Play against a friend on this device</p>
          </div>
        </Link>
        <Link to='/computer' className='group w-full px-5 py-4 sm:rounded-lg flex items-center hover:bg-zinc-200/40 dark:hover:bg-zinc-900/75 duration-300 ease-in-out gap-5'>
          <GoSmiley className='w-10 h-10 text-zinc-300 group-hover:text-zinc-500 dark:text-zinc-700 dark:group-hover:text-zinc-500 duration-300 ease-in-out'/>
          <div className='flex-1 font-medium'>
            <h3 className='text-left text-zinc-400 group-hover:text-zinc-800 dark:text-zinc-500 dark:group-hover:text-zinc-50 text-lg duration-300 ease-in-out'>Computer</h3>
            <p className='text-left text-zinc-300 group-hover:text-zinc-500 dark:text-zinc-700 dark:group-hover:text-zinc-500 text-sm duration-300 ease-in-out'>Play against the computer</p>
          </div>
        </Link>
      </div>
    </>
  )
}

function LocalPlayPage() {
  const [wins, setWins] = useState([0, 0]);
  const [gameState, setGameState] = useState();  // 0b_markedTiles_tileTypes
  const [startingPlayer, setStartingPlayer] = useState(1);
  const [player, setPlayer] = useState();
  const [winningState, setWinningState] = useState();
  useEffect(() => resetGameData(), [])
  function resetGameData() {
    setGameState(0);
    setWinningState(0);
    setPlayer(startingPlayer);
    setStartingPlayer(1-startingPlayer);
  }
  function makeMove(i) {
    let newGameState = gameState | player<<i | 1<<i+9;
    setGameState(newGameState);
    setPlayer(1-player);
    let newWinState = getWinState(newGameState);
    if (!newWinState && (newGameState&(1<<9)-1<<9) == ((1<<9)-1<<9)) {
      newWinState = 1<<18;
    }
    setWinningState(newWinState);
    let winner = getWinner(newGameState);
    if (winner >= 0) {
      let newWins = [...wins];
      newWins[winner]++;
      setWins(newWins);
    }
    if (!newWinState) setPlayer(1-player);
  }
  return (
    <>
      <div className={classNames('flex duration-300 ease-in-out', player != 0 && 'text-zinc-300 dark:text-zinc-700')}>
        <div className='fade-in delay-4 w-full px-8 flex gap-4 items-center text-xl font-medium'>
          <div className='w-6 h-6'><O/></div>
          <div className='flex-1'></div>
          <div>{wins[0]}</div>
        </div>
      </div>
      <div className='px-8'>
        <div className={classNames('w-full duration-1000 ease-in-out')}>
          <Board
            gameState={gameState}
            winningState={winningState}
            player={player}
            onClick={makeMove}
            onFinishedClick={resetGameData}
          />
        </div>
      </div>
      <div className={classNames('flex duration-300 ease-in-out', player != 1 && 'text-zinc-300 dark:text-zinc-700')}>
        <div className='fade-in delay-4 w-full px-8 flex gap-4 items-center text-xl font-medium'>
          <div className='w-6 h-6'><X/></div>
          <div className='flex-1'></div>
          <div>{wins[1]}</div>
        </div>
      </div>
    </>
  )
}

function ComputerPlayPage() {
  const [wins, setWins] = useState([0, 0]);
  const [gameState, setGameState] = useState();
  const [startingPlayer, setStartingPlayer] = useState(1);
  const [player, setPlayer] = useState();
  const [winningState, setWinningState] = useState();
  useEffect(() => resetGameData(), [])
  useEffect(() => {
    if (player != 0) return;
    const timeout = setTimeout(() => {
      const moves = getOptimalMove(gameState^(gameState>>9)*player);
      if (!moves.length) return;
      let i = moves[0|moves.length*Math.random()];
      makeMove(i);
    }, 500)
    return () => clearTimeout(timeout)
  }, [player, gameState]);
  function resetGameData() {
    setGameState(0);
    setWinningState(0);
    setPlayer(startingPlayer);
    setStartingPlayer(1-startingPlayer);
  }
  function makeMove(i) {
    let newGameState = gameState | player<<i | 1<<i+9;
    setGameState(newGameState);
    setPlayer(1-player);
    let newWinState = getWinState(newGameState);
    if (!newWinState && (newGameState&(1<<9)-1<<9) == ((1<<9)-1<<9)) {
      newWinState = 1<<18;
    }
    setWinningState(newWinState);
    let winner = getWinner(newGameState);
    if (winner >= 0) {
      let newWins = [...wins];
      newWins[winner]++;
      setWins(newWins);
    }
    if (!newWinState) setPlayer(1-player);
  }
  return (
    <>
      <div className={classNames('flex duration-300 ease-in-out', player != 0 && 'text-zinc-300 dark:text-zinc-700')}>
        <div className='fade-in delay-4 w-full px-8 flex gap-4 items-center text-xl font-medium'>
          <div className='w-6 h-6'><O/></div>
          <div className='flex-1'>Computer</div>
          <div>{wins[0]}</div>
        </div>
      </div>
      <div className='px-8'>
        <div className={classNames('w-full duration-1000 ease-in-out')}>
          <Board
            gameState={gameState}
            winningState={winningState}
            player={player}
            disabled={player != 1}
            onClick={makeMove}
            onFinishedClick={resetGameData}
          />
        </div>
      </div>
      <div className={classNames('flex duration-300 ease-in-out', player != 1 && 'text-zinc-300 dark:text-zinc-700')}>
        <div className='fade-in delay-4 w-full px-8 flex gap-4 items-center text-xl font-medium'>
          <div className='w-6 h-6'><X/></div>
          <div className='flex-1'>You</div>
          <div>{wins[1]}</div>
        </div>
      </div>
    </>
  )
}

function OnlinePlayPage() {
  const [wins, setWins] = useState([0, 0]);
  const [gameState, setGameState] = useState();
  const [startingPlayer, setStartingPlayer] = useState(1);
  const [player, setPlayer] = useState(1);
  const [winningState, setWinningState] = useState();
  const [you, setYou] = useState();
  const [name, setName] = useState('');
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [names, setNames] = useState(['', ''])
  const [connected, setConnected] = useState(socket.connected);
  const [opponentConnected, setOpponentConnected] = useState(true);
  console.log('player='+player)
  useEffect(() => {
    socket.on('start_game', (data) => {
      console.log('START GAME');
      console.log(data);
      resetGameData()
      setYou(data.you);
      setNames(data.names);
      setNameConfirmed(true);
    })
    socket.on('opponent_disconnected', () => setOpponentConnected(false));
    return () => {
      socket.removeAllListeners();
    }
  }, [])
  useEffect(() => {
    if (you == undefined) return;
    function disconnect() {
      setConnected(false);
    }
    socket.on('disconnect', disconnect);
    return () => socket.off('disconnect', disconnect);
  }, [you])
  useEffect(() => {
    socket.on('make_move', makeMove);
    return () => socket.off('make_move', makeMove);
  }, [player, gameState])
  useEffect(() => {
    socket.on('reset_board', resetGameData);
    return () => socket.off('reset_board', resetGameData);
  }, [startingPlayer])
  useEffect(() => () => {
    if (nameConfirmed) {
      socket.emit('clear_name');
    }
  }, [nameConfirmed])
  function resetGameData() {
    setGameState(0);
    setWinningState(0);
    setPlayer(startingPlayer);
    setStartingPlayer(1-startingPlayer);
  }
  function makeMove(i) {
    let newGameState = gameState | player<<i | 1<<i+9;
    setGameState(newGameState);
    setPlayer(1-player);
    let newWinState = getWinState(newGameState);
    if (!newWinState && (newGameState&(1<<9)-1<<9) == ((1<<9)-1<<9)) {
      newWinState = 1<<18;
    }
    setWinningState(newWinState);
    let winner = getWinner(newGameState);
    if (winner >= 0) {
      let newWins = [...wins];
      newWins[winner]++;
      setWins(newWins);
    }
    if (!newWinState) setPlayer(1-player);
  }
  return you == undefined ? (
    <div className='fade-in flex flex-col px-8 gap-4'>
      <form onSubmit={(e) => {
        e.preventDefault();
        let name2 = name.trim();
        if (!name2) return;
        socket.emit('set_name', name2, () => {
          setName(name2);
          setNameConfirmed(true);
        });
      }}>
        <input autoFocus disabled={nameConfirmed} value={name} onChange={e => setName(e.target.value)} id='name' name='name' autoComplete='off' className='relative block w-full rounded-md border-0 px-4 py-3 bg-zinc-50 text-zinc-800 disabled:text-zinc-400 dark:bg-[black] dark:text-zinc-50 dark:disabled:text-zinc-500 ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-300 dark:ring-zinc-800 dark:placeholder:text-zinc-600 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-zinc-500 dark:focus:ring-zinc-400 text-lg duration-300 ease-in-out' placeholder='Your name'/>
      </form>
      <h1 className={classNames(
        'text-center text-zinc-500 dark:text-zinc-400',
        nameConfirmed && 'animate-pulse',
      )}>
        {nameConfirmed ? 'Waiting for an opponent to join...' : 'Enter your name to continue'}
      </h1>
    </div>
  ) : (
    <>
      <div className={classNames('flex duration-300 ease-in-out', player == you && 'text-zinc-300 dark:text-zinc-700')}>
        <div className='fade-in delay-4 w-full px-8 flex gap-4 items-center text-xl font-medium'>
          <div className='w-6 h-6'>{you != 0 ? <O/> : <X/>}</div>
          <div className={classNames('flex-1 flex items-center', !opponentConnected && 'line-through')}>{names[1-you]}</div>
          <div>{wins[1-you]}</div>
        </div>
      </div>
      <div className='px-8'>
        <div className={classNames('w-full duration-1000 ease-in-out')}>
          <Board
            gameState={gameState}
            winningState={winningState}
            player={player}
            disabled={player != you}
            onClick={(i) => {
              makeMove(i);
              socket.emit('make_move', i);
            }}
            onFinishedClick={() => {
              socket.emit('rematch');
            }}
          />
        </div>
      </div>
      <div className={classNames('flex duration-300 ease-in-out', player != you && 'text-zinc-300 dark:text-zinc-700')}>
        <div className='fade-in delay-4 w-full px-8 flex gap-4 items-center text-xl font-medium'>
          <div className='w-6 h-6'>{you == 0 ? <O/> : <X/>}</div>
          <div className='flex-1 flex items-baseline gap-2'>
            <span className={!connected && 'line-through'}>
              {names[you]}
            </span>
            <span className={classNames(
              'duration-300 ease-in-out font-medium text-sm no-underline',
              player == you ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-200 dark:text-zinc-800'
            )}>
              (You)
            </span>
          </div>
          <div>{wins[you]}</div>
        </div>
      </div>
    </>
  )
}

function LightModeButton() {
  const [light, setLight] = useState(!document.documentElement.classList.contains('dark'));
  useEffect(() => {
    if (light) document.documentElement.classList.remove('dark');
    else document.documentElement.classList.add('dark');
    localStorage.colorTheme = light ? 'light' : 'dark';
  }, [light])
  return (
    <div className='w-full p-6 flex justify-center sm:justify-end items-center top-0 fixed border-b border-zinc-50 dark:border-black sm:bg-transparent pointer-events-none duration-300 ease-in-out'>
      <div className='flex justify-center items-center'>
        <button className='fade-in p-2 rounded-md text-zinc-300 hover:text-zinc-800 dark:text-zinc-700 dark:hover:text-zinc-50 duration-300 ease-in-out pointer-events-auto'
          onClick={() => setLight(!light)}
        >
          {light ? <GoSun className='w-8 h-8'/> : <GoMoon className='w-8 h-8'/>}
        </button>
      </div>
    </div>
  )
}

function App() {
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setIntro(false), 3000);
    return () => clearTimeout(timeout)
  }, [])
  return (
    <div className='bg-zinc-50 dark:bg-black w-full min-h-[100svh] px-0 sm:px-8 py-1 sm:py-8 flex flex-col justify-center items-center bg-gradient-to-br selection:bg-zinc-300 selection:text-zinc-800 dark:selection:bg-zinc-700 dark:selection:text-zinc-50 select-none duration-300 ease-in-out'>
      {!intro ? <>
        <div className='bg-zinc-50 dark:bg-black text-zinc-800 dark:text-zinc-50 w-full sm:px-8 py-28 max-w-md sm:rounded-xl space-y-12 pointer-events-auto duration-300 ease-in-out'>
          <Routes>
            <Route path='/' element={<SelectModePage/>}/>
            <Route path='/online' element={<OnlinePlayPage/>}/>
            <Route path='/local' element={<LocalPlayPage/>}/>
            <Route path='/computer' element={<ComputerPlayPage/>}/>
          </Routes>
        </div>
        <div className='w-full p-6 flex justify-center bottom-0 fixed sm:bottom-auto sm:top-0 sm:justify-start bg-zinc-50 dark:bg-black border-t sm:border-t-0 sm:border-b border-zinc-50 dark:border-black duration-300 ease-in-out'>
          <Link to='/' className='p-2 rounded-md text-zinc-300 hover:text-zinc-800 dark:text-zinc-700 dark:hover:text-zinc-50 duration-300 ease-in-out'>
            <div className='fade-in w-8 aspect-square flex flex-col'>
              <div className='flex-1 w-full flex'>
                <div className='flex-1 h-full'></div>
                <div className='w-[2px] bg-current'></div>
                <div className='flex-1 h-full'></div>
                <div className='w-[2px] bg-current'></div>
                <div className='flex-1 h-full'></div>
              </div>
              <div className='h-[2px] bg-current'></div>
              <div className='flex-1 w-full flex'>
                <div className='flex-1 h-full'></div>
                <div className='w-[2px] bg-current'></div>
                <div className='flex-1 h-full'></div>
                <div className='w-[2px] bg-current'></div>
                <div className='flex-1 h-full'></div>
              </div>
              <div className='h-[2px] bg-current'></div>
              <div className='flex-1 w-full flex'>
                <div className='flex-1 h-full'></div>
                <div className='w-[2px] bg-current'></div>
                <div className='flex-1 h-full'></div>
                <div className='w-[2px] bg-current'></div>
                <div className='flex-1 h-full'></div>
              </div>
            </div>
          </Link>
        </div>
        <LightModeButton/>
      </> :
        <div className='fade-in-out w-16 aspect-square flex flex-col'>
          <div className='flex-1 w-full flex'>
            <div className='flex-1 h-full'></div>
            <div className='w-[3px] bg-current'></div>
            <div className='flex-1 h-full'></div>
            <div className='w-[3px] bg-current'></div>
            <div className='flex-1 h-full'></div>
          </div>
          <div className='h-[3px] bg-current'></div>
          <div className='flex-1 w-full flex'>
            <div className='flex-1 h-full'></div>
            <div className='w-[3px] bg-current'></div>
            <div className='flex-1 h-full'></div>
            <div className='w-[3px] bg-current'></div>
            <div className='flex-1 h-full'></div>
          </div>
          <div className='h-[3px] bg-current'></div>
          <div className='flex-1 w-full flex'>
            <div className='flex-1 h-full'></div>
            <div className='w-[3px] bg-current'></div>
            <div className='flex-1 h-full'></div>
            <div className='w-[3px] bg-current'></div>
            <div className='flex-1 h-full'></div>
          </div>
        </div>
      }
    </div>
  )
}

export default App