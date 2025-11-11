export type LogFunction = (line: string) => Promise<void>;

export interface ScriptStep {
    id: string;
    title: string;
    description: string;
    command: string;
    simulation: (log: LogFunction) => Promise<void>;
}
