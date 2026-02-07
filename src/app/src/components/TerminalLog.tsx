import React, { useEffect, useRef } from 'react';

interface Props {
	logs: { message: string, type: string }[];
}

export const TerminalLog: React.FC<Props> = ({ logs }) => {
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [logs]);

	if (logs.length === 0) return null;

	return (
		<div className="w-full max-w-3xl mx-auto mt-8 bg-[#0a0a0a] rounded-lg border border-gray-800 font-mono text-sm overflow-hidden shadow-2xl">
			<div className="bg-gray-900 px-4 py-2 flex gap-2 border-b border-gray-800">
				<div className="w-3 h-3 rounded-full bg-red-500/50"></div>
				<div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
				<div className="w-3 h-3 rounded-full bg-green-500/50"></div>
				<span className="ml-2 text-gray-500 text-xs">chef-console — zsh</span>
			</div>
			<div className="p-4 h-64 overflow-y-auto space-y-2">
				{logs.map((log, i) => (
					<div key={i} className="break-all animate-fade-in">
						<span className="text-gray-500 mr-2">➜</span>
						<span className={
							log.type === 'error' ? 'text-red-400' :
								log.type === 'success' ? 'text-green-400' :
									log.type === 'warn' ? 'text-yellow-400' :
										'text-blue-300'
						}>
							{log.message}
						</span>
					</div>
				))}
				<div ref={bottomRef} />
			</div>
		</div>
	);
};
