import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHOC, CustomButton, CustomInput, GameLoad } from '../components';
import styles from '../styles';
import { useGlobalContext } from '../context';

const CreateBattle = () => {
    const navigate = useNavigate()
    const { contract, battleName, setBattleName, gameData, setErrorMessage } = useGlobalContext()
    const [waitBattle, setWaitBattle] = useState(false)

    useEffect(() => {
        if (gameData?.activeBattle?.battleStatus === 1) {
            navigate(`/battle/${gameData.activeBattle.name}`)
        }
        else if (gameData?.activeBattle?.battleStatus === 0) {
            setWaitBattle(true)
        }
    }, [gameData])


    const handleClick = async () => {
        if (!battleName || !battleName.trim()) return null

        try {
            await contract.createBattle(battleName, { gasLimit: 200000 })
            setWaitBattle(true)
        } catch (error) {
            setErrorMessage(error)
        }
    }

    return (
        <>
            {waitBattle && <GameLoad />}
            <div className=' flex flex-col mb-5'>
                <CustomInput label='Battle' placeholder='Enter battle name' value={battleName} handleValueChange={setBattleName} />
                <CustomButton title='Create Battle' handleClick={handleClick} restType='mt-6' />
            </div>
            <p className={styles.infoText} onClick={() => navigate('/join-battle')}>Or join already existing battles</p>
        </>
    )
};

export default PageHOC(
    CreateBattle,
    <>Create <br /> a new battle</>,
    <>Create your own battle and wait for other players to join you</>
);