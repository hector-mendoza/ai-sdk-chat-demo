type ComposerProps = {
  input: string;
  disabled: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
};

export function Composer({ input, disabled, onInputChange, onSubmit }: ComposerProps) {
  return (
    <form
      className="flex gap-2 border-t border-slate-200 bg-white p-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none ring-blue-500 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100"
        disabled={disabled}
        onChange={(event) => onInputChange(event.target.value)}
        placeholder="What's the weather in Tokyo?"
        value={input}
      />
      <button
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={disabled || input.trim().length === 0}
        type="submit"
      >
        Send
      </button>
    </form>
  );
}
