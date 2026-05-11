import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { mockReports, type Report  } from '@/data/mockReports'


type AudioContextType = {
    currentTime: number
    duration: number
    isPlaying: boolean
    togglePlay: () => void
    seek: (val: number) => void
    activeReport: Report
    selectReport: (id: string) => void
    hasUnlistened: boolean
}

const AudioContext = createContext<AudioContextType | null>(null)


const AudioProvider = ({children}: { children: React.ReactNode}) => {
    
    const audioRef = useRef<HTMLAudioElement>(null)
    
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false) 

    const [activeReportId, setActiveReportId] = useState(mockReports[mockReports.length - 1].id)
    const [listenedIds, setListenedIds] = useState<Set<string>>(new Set())

    const selectReport = (id: string) => {
        if (id === activeReportId) return
        setIsPlaying(false)
        setCurrentTime(0)
        setDuration(0)
        setActiveReportId(id)

        const audio = audioRef.current
        if (!audio) return
        audio.src = mockReports.find(r => r.id === id )!.audioSrc
        audio.load()
    }

    const activeReport = mockReports.find(r => r.id === activeReportId)!


    const lastReport = mockReports[mockReports.length - 1]
    const hasUnlistened = !lastReport.listened && !listenedIds.has(lastReport.id)

    useEffect(() => {
            const audio = audioRef.current
            if (!audio) return

            const onTimeUpdate = () => setCurrentTime(audio.currentTime)
            const onLoadMetadata = () => setDuration(audio.duration)
            const onEnded = () => {
                setIsPlaying(false)
                setListenedIds(prev => new Set([...prev, activeReportId]))
            }

            audio.addEventListener('timeupdate', onTimeUpdate)
            audio.addEventListener('loadedmetadata', onLoadMetadata)
            audio.addEventListener('ended', onEnded)
        
            return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate)
            audio.removeEventListener('loadedmetadata', onLoadMetadata)
            audio.removeEventListener('ended', onEnded)
            }
        }, [activeReportId])

    const togglePlay = () => {
        const audio = audioRef.current
        if (!audio) return
        if (isPlaying) {
            audio.pause()
        } else {
            audio.play()
        }
        setIsPlaying(p => !p)
    }

    const seek = (val: number) => {
        const audio = audioRef.current
        if (!audio) return
        if (duration === 0) return
        audio.currentTime = (val/100)*duration
    }


  return (
    <AudioContext.Provider value={{ currentTime, duration, isPlaying, togglePlay, seek, activeReport, selectReport, hasUnlistened}}>
        <audio ref={audioRef} src={activeReport.audioSrc} preload='metadata'/>
        {children}
    </AudioContext.Provider>
  )
}

export const useAudio = () => {
    const ctx = useContext(AudioContext)
    if (!ctx) throw new Error('useAudio debe usarse dentro de AudioProvider')
    return ctx
}

export {AudioProvider}