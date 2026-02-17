"use client"

import React, { useEffect, useRef, useState } from "react"

interface LogItem {
	message: string
	type?: string
}

interface TerminalProps {
	logs: LogItem[]
	error?: string
	className?: string
}

export const TerminalLog: React.FC<TerminalProps> = ({
	logs,
	error,
	className = "",
}) => {
	const [visibleCount, setVisibleCount] = useState(0)
	const bottomRef = useRef<HTMLDivElement>(null)
	const dialogRef = useRef<HTMLDialogElement>(null)
	const prevLogsLengthRef = useRef(0)

	useEffect(() => {
		// Only reset if logs were completely cleared (length went to 0)
		if (logs.length === 0) {
			setVisibleCount(0)
			prevLogsLengthRef.current = 0
		} else if (logs.length < prevLogsLengthRef.current) {
			// Logs were reduced but not cleared - reset
			setVisibleCount(0)
			prevLogsLengthRef.current = logs.length
		} else {
			// Logs increased - just update the ref
			prevLogsLengthRef.current = logs.length
		}
	}, [logs.length])

	useEffect(() => {
		if (visibleCount >= logs.length) return

		const timeout = setTimeout(() => {
			setVisibleCount((prev) => prev + 1)
		}, 120)

		return () => clearTimeout(timeout)
	}, [visibleCount, logs.length])

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [visibleCount])

	useEffect(() => {
		if (error && dialogRef.current) {
			dialogRef.current.showModal()
		}
	}, [error])

	const getColor = (type?: string) => {
		switch (type) {
			case "error":
				return "text-red-400"
			case "success":
				return "text-green-400"
			case "warn":
				return "text-yellow-400"
			default:
				return "text-blue-300"
		}
	}

	const handleForceStart = () => {
		setVisibleCount(logs.length)
		dialogRef.current?.close()
	}

	if (logs.length === 0) return null

	const handleClose = () => {
		// Just close the browser window
		window.close()
	}

	return (
		<div
			className={`w-full max-w-3xl mx-auto mt-8 bg-[#0a0a0a] rounded-xl border border-zinc-800 font-mono text-sm overflow-hidden shadow-2xl ${className}`}
		>
			<div className="bg-zinc-900 px-4 py-2 flex items-center gap-2 border-b border-zinc-800">
				<button
					onClick={handleClose}
					className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group relative transition-colors cursor-pointer"
					aria-label="Close"
				>
					<span className="text-[8px] text-red-900 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
						✕
					</span>
					<span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
						Close
					</span>
				</button>
				<div className="w-3 h-3 rounded-full bg-yellow-500" />
				<div className="w-3 h-3 rounded-full bg-green-500" />
				<span className="ml-3 text-zinc-500 text-xs tracking-wide">
					chef-console — zsh
				</span>
			</div>

			<div className="p-4 h-72 overflow-y-auto space-y-2">
				{logs.slice(0, visibleCount).map((log, index) => (
					<div
						key={index}
						className="flex items-start gap-2 opacity-0 animate-[fadeIn_0.25s_ease-out_forwards]"
					>
						<span className="text-zinc-500">➜</span>
						<span className={getColor(log.type)}>{log.message}</span>
					</div>
				))}

				<div ref={bottomRef} />
			</div>

			{error && (
				<dialog
					ref={dialogRef}
					className="rounded-lg border border-zinc-700 bg-zinc-900 p-6 text-sm text-white shadow-xl"
				>
					<p className="mb-4 text-red-400">{error}</p>
					<div className="flex justify-end gap-3">
						<button
							onClick={() => dialogRef.current?.close()}
							className="px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600"
						>
							Close
						</button>
						<button
							onClick={handleForceStart}
							className="px-3 py-1 rounded bg-red-600 hover:bg-red-500"
						>
							Use Force
						</button>
					</div>
				</dialog>
			)}
		</div>
	)
}
