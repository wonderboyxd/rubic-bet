'use client'
import React, { FC, useEffect, useState } from "react";
import { classNames } from "@/shared/helpers/classNames/classNames";
import cls from './Playground.module.scss'
import { AppText } from "@/shared/ui/AppText";
import { AppTextColor, AppTextWeight } from "@/shared/ui/AppText/ui/AppText.helper";
import { Cubic } from "@/shared/ui/Cubic";
import { AppSelect } from "@/shared/ui/AppSelect";
import { IOptionsItem } from '@/shared/ui/AppSelect'
import { Keyboard } from "@/widgets/Keyboard";
import { AppButton } from "@/shared/ui/AppButton";
import { AppButtonColor } from "@/shared/ui/AppButton/ui/AppButton";
import { useAppStore } from "@/app/providers/Store/store";

export interface ICubicValue {
    text: string,
    value: number
}

export const Playground: FC = () => {

    const betsSelectList: IOptionsItem[] = [
        {title: '1', value: '1'},
        {title: '5', value: '5'},
        {title: '10', value: '10'},
        {title: '15', value: '15'},
        {title: '20', value: '20'}
    ]
    const cubicValues: ICubicValue[] = [
        { text: 'ONE', value: 1},
        { text: 'TWO', value: 2},
        { text: 'THREE', value: 3},
        { text: 'FOUR', value: 4},
        { text: 'FIVE', value: 5},
        { text: 'SIX', value: 6},
    ]

    const [cubicValue, setCubicValue] = useState<ICubicValue>(cubicValues[0])
    const [keyboardButtonPressed, setKeyboardButtonPressed] = useState<string>()
    const [betSize, setBetSize] = useState<number>(+betsSelectList[0].value)
    const {userBalance, setUserBalance} = useAppStore()
    const [notificationTitle, setNotificationTitle] = useState<string>('Сделайте ставку')
    const [notificationSubtitle, setNotificationSubtitle] = useState<string>('')

    

    const onSelectBetSize = (bet: IOptionsItem) => {
        setBetSize(+bet.value)
    }
  
    const checkWIN = () => {
        
        switch (true) {
            case keyboardButtonPressed === 'EVEN':
                if (cubicValue.value % 2 === 0) {
                    setUserBalance(userBalance + (betSize * 2)) 
                    setNotificationSubtitle(`Вы выиграли ${betSize} TND!`)
                } else {
                    setUserBalance(userBalance - betSize)
                    setNotificationSubtitle('Повезет в следующий раз!')
                }
                break;
            case keyboardButtonPressed === 'UNEVEN':
                if (cubicValue.value % 2 !== 0) {
                    setUserBalance(userBalance + (betSize * 2))
                    setNotificationSubtitle(`Вы выиграли ${betSize} TND!`)
                } else {
                    setUserBalance(userBalance - betSize)
                    setNotificationSubtitle('Повезет в следующий раз!')
                }
                break;
            case keyboardButtonPressed === 'FROM_ONE_TO_THREE':
                if (cubicValue.value >= 1 && cubicValue.value <= 3) {
                    setUserBalance(userBalance + (betSize * 2))
                    setNotificationSubtitle(`Вы выиграли ${betSize} TND!`)
                } else {
                    setUserBalance(userBalance - betSize)
                    setNotificationSubtitle('Повезет в следующий раз!')
                }
                break;
            case keyboardButtonPressed === 'FROM_FOUR_TO_SIX':
                if (cubicValue.value >= 4 && cubicValue.value <= 6) {
                    setUserBalance(userBalance + (betSize * 2))
                    setNotificationSubtitle(`Вы выиграли ${betSize} TND!`)
                } else {
                    setUserBalance(userBalance - betSize)
                    setNotificationSubtitle('Повезет в следующий раз!')
                }
            default:
                return;
        }
        setNotificationTitle(`Результат броска: ${cubicValue.value}`)

    }
    
    const onPlaceABet = () => {
        if (keyboardButtonPressed && (userBalance - betSize) >= 0) {
            setCubicValue(cubicValues[Math.floor(Math.random() * (7 - 1) + 1) - 1])
        }
    }

    useEffect(() => {
        if (keyboardButtonPressed) {
            checkWIN()
        }
    }, [cubicValue])

    const onSelectBetOption = (buttonValue: string) => {
        setKeyboardButtonPressed(buttonValue)
    }

    return (
        <div className={classNames(cls.playground)}>
            <header className={cls.playgroundHeader}>
            <AppText className={cls.playgroundTitle} text={notificationTitle} weight={AppTextWeight.BOLD} />
            {notificationSubtitle && <AppText className={cls.playgroundTitle} text={notificationSubtitle} size={16} weight={AppTextWeight.REGULAR} />}
            </header>
            <Cubic cubicValue={cubicValue}/>
            <AppText text={`Баланс: ${userBalance}`} color={AppTextColor.WHITE} />
            <div className={cls.playgroundActivities}>
                <AppSelect options={betsSelectList} defaultValue={betsSelectList[0]} label="Размер ставки" onSelect={(value) => onSelectBetSize(value)}/>
                <Keyboard onSelect={(buttonValue) => onSelectBetOption(buttonValue)} />
            </div>
            <AppButton text="Сделать ставку" color={AppButtonColor.GREEN} textColor={AppTextColor.WHITE} onClick={() => onPlaceABet()} />
        </div>
    )
}