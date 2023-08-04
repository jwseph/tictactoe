import { useState, useRef } from 'react'
import './App.css'
import { GoGlobe, GoPeople, GoSmiley }from 'react-icons/go'
import { Route, Link, Routes, useNavigate, useParams } from 'react-router-dom'

const classNames = (...classes) => classes.filter(Boolean).join(' ');

const PLAYERS = 'OX';

function Mark({type, hidden}) {
  return type == 0 ? (
    <div className={classNames(
      'w-full h-full text-center p-6 duration-300 ease-in-out',
      hidden ? 'opacity-0 hover:opacity-30 hover:cursor-pointer' : 'opacity-90',
    )}>
      <div className='w-full h-full rounded-full p-[4px] bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200'>
        <div className='w-full h-full rounded-full bg-black'></div>
      </div>
    </div>
  ) : type == 1 ? (
    <div className={classNames(
      'w-full h-full flex justify-center items-center p-6 duration-300 ease-in-out',
      hidden ? 'opacity-0 hover:opacity-30 hover:cursor-pointer' : 'opacity-90',
    )}>
      <div className='w-[4px] h-[calc(125%-4px)] rotate-45 relative bg-zinc-100'></div>
      <div className='w-[4px] h-[calc(125%-4px)] rotate-[135deg] relative -ml-[4px] bg-gradient-to-t from-zinc-50 via-zinc-100 to-zinc-200'></div>
    </div>
  ) : (
    <div className='w-full h-full'></div>
  );
}

function Board({gameState, player, onClick, disabled}) {
  return (
    <div className='fade-in'>
      <div className='w-full aspect-square flex flex-col border-2 border-zinc-700 rounded-xl'>
        <div className='flex-1 w-full flex'>
          <div className='flex-1 h-full border border-zinc-700 border-t-0 border-l-0'>
            {gameState>>9&1
              ? <Mark type={gameState&1}/>
              : !disabled && <button className='w-full h-full' onClick={() => onClick(0)}><Mark type={player} hidden/></button>
            }
          </div>
          <div className='flex-1 h-full border border-zinc-700 border-t-0'>
            {gameState>>9+1&1
              ? <Mark type={gameState>>1&1}/>
              : !disabled && <button className='w-full h-full' onClick={() => onClick(1)}><Mark type={player} hidden/></button>
            }
          </div>
          <div className='flex-1 h-full border border-zinc-700 border-t-0 border-r-0'>
            {gameState>>9+2&1
              ? <Mark type={gameState>>2&1}/>
              : !disabled && <button className='w-full h-full' onClick={() => onClick(2)}><Mark type={player} hidden/></button>
            }
          </div>
        </div>
        <div className='flex-1 w-full flex'>
          <div className='flex-1 h-full border border-zinc-700 border-l-0'>
            {gameState>>9+3&1
              ? <Mark type={gameState>>3&1}/>
              : !disabled && <button className='w-full h-full' onClick={() => onClick(3)}><Mark type={player} hidden/></button>
            }
          </div>
          <div className='flex-1 h-full border border-zinc-700'>
            {gameState>>9+4&1
              ? <Mark type={gameState>>4&1}/>
              : !disabled && <button className='w-full h-full' onClick={() => onClick(4)}><Mark type={player} hidden/></button>
            }
          </div>
          <div className='flex-1 h-full border border-zinc-700 border-r-0'>
            {gameState>>9+5&1
              ? <Mark type={gameState>>5&1}/>
              : !disabled && <button className='w-full h-full' onClick={() => onClick(5)}><Mark type={player} hidden/></button>
            }
          </div>
        </div>
        <div className='flex-1 w-full flex'>
          <div className='flex-1 h-full border border-zinc-700 border-b-0 border-l-0'>
            {gameState>>9+6&1
              ? <Mark type={gameState>>6&1}/>
              : !disabled && <button className='w-full h-full' onClick={() => onClick(6)}><Mark type={player} hidden/></button>
            }
          </div>
          <div className='flex-1 h-full border border-zinc-700 border-b-0'>
            {gameState>>9+7&1
              ? <Mark type={gameState>>7&1}/>
              : !disabled && <button className='w-full h-full' onClick={() => onClick(7)}><Mark type={player} hidden/></button>
            }
          </div>
          <div className='flex-1 h-full border border-zinc-700 border-b-0 border-r-0'>
            {gameState>>9+8&1
              ? <Mark type={gameState>>8&1}/>
              : !disabled && <button className='w-full h-full' onClick={() => onClick(8)}><Mark type={player} hidden/></button>
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
      <svg width='0' height='0'>
        <linearGradient id='blue-gradient' x1='100%' y1='100%' x2='0%' y2='0%'>
          <stop stopColor='#2563eb' offset='0%'/>
          <stop stopColor='#0ea5e9' offset='100%'/>
        </linearGradient>
        <linearGradient id='yellow-gradient' x1='100%' y1='100%' x2='0%' y2='0%'>
          <stop stopColor='#f97316' offset='0%'/>
          <stop stopColor='#eab308' offset='100%'/>
        </linearGradient>
        <linearGradient id='purple-gradient' x1='100%' y1='100%' x2='0%' y2='0%'>
          <stop stopColor='#8b5cf6' offset='0%'/>
          <stop stopColor='#d946ef' offset='100%'/>
        </linearGradient>
      </svg>
      <div className='fade-in flex flex-col gap-2'>
        <Link to='online' className='group w-full px-5 py-4 sm:rounded-lg flex items-center opacity-50 hover:opacity-100 hover:bg-zinc-900/75 duration-300 ease-in-out gap-5'>
          <GoGlobe className='w-10 h-10 text-zinc-500'/>
          <div className='flex-1 font-medium'>
            <h3 className='text-left text-zinc-200 text-lg'>Online</h3>
            <p className='text-left text-zinc-500 text-sm'>Play against an online opponent</p>
          </div>
        </Link>
        <Link to='/local' className='group w-full px-5 py-4 sm:rounded-lg flex items-center opacity-50 hover:opacity-100 hover:bg-zinc-900/75 duration-300 ease-in-out gap-5'>
          <GoPeople className='w-10 h-10 text-zinc-500'/>
          <div className='flex-1 font-medium'>
            <h3 className='text-left text-zinc-200 text-lg'>Local</h3>
            <p className='text-left text-zinc-500 text-sm'>Play against a friend on this device</p>
          </div>
        </Link>
        <Link to='/computer' className='group w-full px-5 py-4 sm:rounded-lg flex items-center opacity-50 hover:opacity-100 hover:bg-zinc-900/75 duration-300 ease-in-out gap-5'>
          <GoSmiley className='w-10 h-10 text-zinc-500'/>
          <div className='flex-1 font-medium'>
            <h3 className='text-left text-zinc-200 text-lg'>Computer</h3>
            <p className='text-left text-zinc-500 text-sm'>Play against the computer</p>
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

function LocalPlayPage() {
  const [wins, setWins] = useState([0, 0]);
  const [gameState, setGameState] = useState(0);  // 0b_markedTiles_tileTypes
  const [player, setPlayer] = useState(0);
  function checkWin(state) {
    for (const winState of WIN_STATES) {
      if ((state>>9&winState) != winState) continue;
      let taken = state&0b111111111&winState;
      if (taken == 0) {
        console.log('O won')
      }
      if (taken == winState) {
        console.log('X won')
      }
    }
  }
  return (
    <>
      <div className='flex'>
        <div className='fade-in delay-2 px-8 flex gap-2 items-center'>
          <div className='w-5 h-5 ring-2 ring-inset ring-zinc-100 rounded-full'></div>
          <div className='text-lg font-medium'>{wins[0]}</div>
        </div>
      </div>
      <div className='w-full px-8'>
        <Board
          gameState={gameState}
          player={player}
          onClick={(i) => {
            console.log(i, 'Clicked!');
            let newGameState = gameState | player<<i | 1<<i+9;
            setGameState(newGameState);
            checkWin(newGameState);
            setPlayer(1-player);
          }}
        />
      </div>
      <div className='flex flex-row-reverse'>
        <div className='fade-in delay-2 px-8 flex flex-row-reverse gap-2 items-center'>
          <div className='w-5 h-5 flex justify-center items-center'>
            <div className='w-[2px] h-[calc(125%-2px)] rotate-45 relative bg-zinc-100'></div>
            <div className='w-[2px] h-[calc(125%-2px)] rotate-[135deg] relative -ml-[2px] bg-gradient-to-t from-zinc-50 via-zinc-100 to-zinc-200'></div>
          </div>
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
    </div>
  )
}

export default App