import { useState, useRef, useEffect } from 'react'
import './App.css'
import { GoGlobe, GoPeople, GoSmiley }from 'react-icons/go'
import { Route, Link, Routes, useNavigate, useParams } from 'react-router-dom'

const classNames = (...classes) => classes.filter(Boolean).join(' ');

const PLAYERS = 'OX';

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

function solve(state) {
  // Returns -1 (X win), 0 (tie), or 1 (O win), assuming O goes first
  if ((state>>9&(1<<9)-1) == (1<<9)-1) return 0;
  for (const winState of WIN_STATES) {
    if ((state>>9&winState) != winState) continue;
    let taken = state&0b111111111&winState;
    if (taken == 0) return 1;
    if (taken == winState) return -1;
  }
  let res = -Infinity;
  for (let i = 0; i < 9; ++i) {
    if (state&1<<9+i) continue;
    let newState = state|1<<9+i;
    res = Math.max(res, -solve(newState^newState>>9));
  }
  return res;
}

function getOptimalMove(state) {
  if ((state>>9&(1<<9)-1) == (1<<9)-1) return 0;
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
      transparent ? 'become-transparent' : hidden ? 'text-black hover:text-zinc-900 cursor-pointer' : 'place opacity-100',
    )}>
      <O/>
    </div>
  ) : type == 1 ? (
    <div className={classNames(
      'w-full h-full flex justify-center items-center p-5',
      transparent ? 'become-transparent' : hidden ? 'text-black hover:text-zinc-900 cursor-pointer' : 'place opacity-100',
    )}>
      <X/>
    </div>
  ) : (
    <div className='w-full h-full'></div>
  );
}

function Board({gameState, winningState, player, onClick, onFinishedClick, disabled}) {
  return (
    <div className='fade-in'>
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
          <div className='w-[5px] bg-zinc-700'></div>
          <div className='flex-1 h-full'>
            {gameState>>9+1&1
              ? <Mark type={gameState>>1&1} transparent={winningState && !(winningState>>1&1)}/>
              : !disabled && !winningState  && <div className='w-full h-full cursor-pointer' onClick={() => onClick(1)}><Mark type={player} hidden/></div>
            }
          </div>
          <div className='w-[5px] bg-zinc-700'></div>
          <div className='flex-1 h-full'>
            {gameState>>9+2&1
              ? <Mark type={gameState>>2&1} transparent={winningState && !(winningState>>2&1)}/>
              : !disabled && !winningState  && <div className='w-full h-full cursor-pointer' onClick={() => onClick(2)}><Mark type={player} hidden/></div>
            }
          </div>
        </div>
        <div className='h-[5px] bg-zinc-700'></div>
        <div className='flex-1 w-full flex'>
          <div className='flex-1 h-full'>
            {gameState>>9+3&1
              ? <Mark type={gameState>>3&1} transparent={winningState && !(winningState>>3&1)}/>
              : !disabled && !winningState  && <div className='w-full h-full cursor-pointer' onClick={() => onClick(3)}><Mark type={player} hidden/></div>
            }
          </div>
          <div className='w-[5px] bg-zinc-700'></div>
          <div className='flex-1 h-full'>
            {gameState>>9+4&1
              ? <Mark type={gameState>>4&1} transparent={winningState && !(winningState>>4&1)}/>
              : !disabled && !winningState  && <div className='w-full h-full cursor-pointer' onClick={() => onClick(4)}><Mark type={player} hidden/></div>
            }
          </div>
          <div className='w-[5px] bg-zinc-700'></div>
          <div className='flex-1 h-full'>
            {gameState>>9+5&1
              ? <Mark type={gameState>>5&1} transparent={winningState && !(winningState>>5&1)}/>
              : !disabled && !winningState  && <div className='w-full h-full cursor-pointer' onClick={() => onClick(5)}><Mark type={player} hidden/></div>
            }
          </div>
        </div>
        <div className='h-[5px] bg-zinc-700'></div>
        <div className='flex-1 w-full flex'>
          <div className='flex-1 h-full'>
            {gameState>>9+6&1
              ? <Mark type={gameState>>6&1} transparent={winningState && !(winningState>>6&1)}/>
              : !disabled && !winningState  && <div className='w-full h-full cursor-pointer' onClick={() => onClick(6)}><Mark type={player} hidden/></div>
            }
          </div>
          <div className='w-[5px] bg-zinc-700'></div>
          <div className='flex-1 h-full'>
            {gameState>>9+7&1
              ? <Mark type={gameState>>7&1} transparent={winningState && !(winningState>>7&1)}/>
              : !disabled && !winningState  && <div className='w-full h-full cursor-pointer' onClick={() => onClick(7)}><Mark type={player} hidden/></div>
            }
          </div>
          <div className='w-[5px] bg-zinc-700'></div>
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
      {/* <h1 className='text-2xl font-semibold tracking-tighter'>Select gamemode</h1> */}
      <div className='fade-in flex flex-col gap-2'>
        <Link to='/online' className='group w-full px-5 py-4 sm:rounded-lg flex items-center hover:bg-zinc-900/75 duration-300 ease-in-out gap-5'>
          <GoGlobe className='w-10 h-10 text-zinc-700 group-hover:text-zinc-500 duration-300 ease-in-out'/>
          <div className='flex-1 font-medium'>
            <h3 className='text-left text-zinc-500 group-hover:text-zinc-200 text-lg duration-300 ease-in-out'>Online</h3>
            <p className='text-left text-zinc-700 group-hover:text-zinc-500 text-sm duration-300 ease-in-out'>Play against an online opponent</p>
          </div>
        </Link>
        <Link to='/local' className='group w-full px-5 py-4 sm:rounded-lg flex items-center hover:bg-zinc-900/75 duration-300 ease-in-out gap-5'>
          <GoPeople className='w-10 h-10 text-zinc-700 group-hover:text-zinc-500 duration-300 ease-in-out'/>
          <div className='flex-1 font-medium'>
            <h3 className='text-left text-zinc-500 group-hover:text-zinc-200 text-lg duration-300 ease-in-out'>Local</h3>
            <p className='text-left text-zinc-700 group-hover:text-zinc-500 text-sm duration-300 ease-in-out'>Play against a friend on this device</p>
          </div>
        </Link>
        <Link to='/computer' className='group w-full px-5 py-4 sm:rounded-lg flex items-center hover:bg-zinc-900/75 duration-300 ease-in-out gap-5'>
          <GoSmiley className='w-10 h-10 text-zinc-700 group-hover:text-zinc-500 duration-300 ease-in-out'/>
          <div className='flex-1 font-medium'>
            <h3 className='text-left text-zinc-500 group-hover:text-zinc-200 text-lg duration-300 ease-in-out'>Computer</h3>
            <p className='text-left text-zinc-700 group-hover:text-zinc-500 text-sm duration-300 ease-in-out'>Play against the computer</p>
          </div>
        </Link>
      </div>
      {/* <div>Online GoGlobe</div>
      <div>Local GoPeople</div>
      <div>Computer GoSmiley</div> */}
      {/* <TicTacToe/> */}
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
  function getWinState(state) {
    for (const winState of WIN_STATES) {
      if ((state>>9&winState) != winState) continue;
      let taken = state&0b111111111&winState;
      if (taken == 0 || taken == winState) return winState;
    }
    return 0;
  }
  function getWinner(state) {
    for (const winState of WIN_STATES) {
      if ((state>>9&winState) != winState) continue;
      let taken = state&0b111111111&winState;
      if (taken == 0) {
        setWinningState(winState);
        return 0;
      }
      if (taken == winState) {
        setWinningState(winState);
        return 1;
      }
    }
    return -1;
  }
  return (
    <>
      <div className={classNames('flex duration-300 ease-in-out', player != 0 && 'text-zinc-700')}>
        <div className='fade-in delay-4 w-full px-8 flex gap-4 items-center'>
          <div className='w-5 h-5'><O/></div>
          <div className='font-medium text-lg flex-1'>Person B</div>
          <div className='text-lg font-medium'>{wins[0]}</div>
        </div>
      </div>
      <div className='px-8'>
        <div className={classNames('w-full duration-1000 ease-in-out')}>
          <Board
            gameState={gameState}
            winningState={winningState}
            player={player}
            onClick={(i) => {
              setPlayer(1-player);
              console.log(i, 'Clicked!');
              let newGameState = gameState | player<<i | 1<<i+9;
              setGameState(newGameState);
              console.log('solve', solve(newGameState^(newGameState>>9)*(1-player)))
              console.log('optimalMove', getOptimalMove(newGameState^(newGameState>>9)*(1-player)));
              let newWinState = getWinState(newGameState);
              console.log(newGameState, newWinState);
              if (!newWinState && (newGameState&(1<<9)-1<<9) == ((1<<9)-1<<9)) {
                console.log('Draw');
                newWinState = 1<<18;
              }
              console.log(newWinState);
              setWinningState(newWinState);
              if (newWinState) setPlayer(player);
              let winner = getWinner(newGameState);
              if (winner < 0) return;
              let newWins = [...wins];
              newWins[winner]++;
              setWins(newWins);
            }}
            onFinishedClick={() => {
              resetGameData();
            }}
          />
        </div>
        {/* <div className='relative w-full aspect-square mt-[-100%] bg-zinc-700/50'>
          <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
            <circle cx='50' cy='50' r='48' fill='none' stroke='white' strokeWidth='4'/>
          </svg>
        </div> */}
      </div>
      <div className={classNames('flex duration-300 ease-in-out', player != 1 && 'text-zinc-700')}>
        <div className='fade-in delay-4 w-full px-8 flex gap-4 items-center'>
          <div className='w-5 h-5'><X/></div>
          <div className='font-medium text-lg flex-1'>Person A</div>
          <div className='text-lg font-medium'>{wins[1]}</div>
        </div>
      </div>
    </>
  )
}

function App() {
  return (
    <div className='bg-black w-full min-h-full px-0 sm:px-8 py-1 sm:py-8 flex flex-col justify-center items-center bg-gradient-to-br selection:bg-violet-300/25 selection:text-zinc-50 select-none'>
      <div className='bg-black text-zinc-200 w-full sm:px-8 py-12 max-w-md sm:rounded-xl space-y-12'>
        <Routes>
          <Route path='/' element={<SelectModePage/>}/>
          <Route path='/local' element={<LocalPlayPage/>}/>
        </Routes>
      </div>
      <div className='w-full p-6 flex justify-center bottom-0 absolute sm:bottom-auto sm:top-0 sm:justify-start bg-black/50 backdrop-blur-sm'>
        <Link to='/' className='fade-in delay-4 p-2 rounded-md text-zinc-700 hover:text-zinc-200 duration-300 ease-in-out'>
          <div className='w-8 aspect-square flex flex-col'>
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
    </div>
  )
}

export default App