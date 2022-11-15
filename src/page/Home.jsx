import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomButton, CustomInput, PageHOC } from '../components';
import { useGlobalContext } from '../context';

const Home = () => {
  const [playerName, setPlayerName] = useState('')
  const { contract, walletAddress, setShowAlert, gameData, setErrorMessage } = useGlobalContext()
  const navigate = useNavigate()

  const handleClick = async () => {
    try {
      console.log({ contract })
      const playerExists = await contract.isPlayer(walletAddress)

      if (!playerExists) {
        await contract.registerPlayer(playerName, playerName, { gasLimit: 200000 })
        setShowAlert({ status: true, type: 'info', message: `${playerName} is being summoned!` })
      }

    } catch (error) {
      setErrorMessage(error)
      alert(error)
    }
  }

  useEffect(() => {
    const checkForPlayerToken = async () => {
      const playerExists = await contract.isPlayer(walletAddress)
      const playerTokenExists = await contract.isPlayerToken(walletAddress)
      if (playerExists && playerTokenExists) navigate('/create-battle')
    }

    if (contract) checkForPlayerToken()
  }, [contract])

  useEffect(() => {
    if (gameData.activeBattle) {
      navigate(`/battle/${gameData.activeBattle.name}`)
    }
  }, [gameData])



  return (
    <div className=' flex flex-col'>
      <CustomInput label='Name' placeholder='Enter your player name' value={playerName} handleValueChange={setPlayerName} />
      <CustomButton title='Register' handleClick={handleClick} restType='mt-6' />
    </div>
  )
};

export default PageHOC(
  Home,
  <>Welcome to Avax Gods <br /> a Web3 NFT Card Game</>,
  <>Connect your wallet to start playing <br /> the ultimate Web3 Battle Card Game</>
);