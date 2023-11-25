import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { readContract, writeContract, waitForTransaction } from '@wagmi/core'
import { erc20ABI, useAccount } from 'wagmi';
import Contracts from '../../utils/contract';
import { formatEther, parseEther } from 'viem';
import FaucetABI from "../../utils/Faucet.json";
import Link from 'next/link';

const Faucet: NextPage = () => {
    const [amount, setAmount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [balance, setBalance] = useState(0)
    const { address } = useAccount()
    useEffect(() => {
        const getBalance = async () => {
            const balanceDAI = await readContract({
                address: `0x${Contracts.DAI_Testnet}`,
                abi: erc20ABI,
                functionName: 'balanceOf',
                args: [address!],
                account: address!
            })
            setBalance(Number(formatEther(BigInt(Number(isNaN(Number(balanceDAI)) ? 0 : balanceDAI)))))
            console.log(balanceDAI)
        }

        getBalance()
    }, [])

    const mintDAI = async () => {
        try {
            setLoading(true)
            const { hash: FaucetTxHash } = await writeContract({
                address: `0x${Contracts.Faucet}`,
                abi: FaucetABI,
                functionName: 'mint',
                account: address,
                args: [`0x${Contracts.DAI_Testnet}`, address, parseEther(String(amount))],
            })
            await waitForTransaction({
                hash: FaucetTxHash
            })
            setLoading(false)
            setBalance(balance + amount)
            setAmount(0)
        } catch (e) { }
    }

    return (
        <div>
            <div className=' mt-12 ml-8 ' >
                <Link href="/" className='font-semibold'  >{`< Move Back to Supply`}</Link>
            </div>
            <div className=' flex flex-col  items-center justify-center  mt-14' >
                <div className=' font-medium text-lg ' >{`You can mint upto ${10000 - balance} DAI Token`}</div>
                <div className=' font-semibold text-lg my-4 ' >{`Your DAI Balance = ${balance}`}</div>

                <ConnectButton />
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                        const value = Number(e.target.value)
                        if (value > 10000 - balance) return
                        setAmount(value)
                    }}

                    className=' mt-8 px-4 py-4 font-medium w-[30%] border-2 rounded-lg focus:outline-none'
                />
                {
                    !loading ?
                        <>  <button
                            disabled={amount === 0 ? true : false}
                            className={` ${amount === 0 ? "bg-[#a8c7ee]" : "bg-[#0e76fd]"}  rounded-lg px-8 py-2 text-white font-bold  mt-4 w-[30%] `}
                            onClick={mintDAI}>
                            {`${amount === 0 ? "Enter Minting Amount" : "MINT"}`}
                        </button>
                        </>
                        :
                        <>
                            <div className="loader"></div>
                        </>
                }
            </div>
        </div>
    );
};

export default Faucet;
