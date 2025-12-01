import React from "react";

type FraseTesteProps = {
  text?: string;
  className?: string;
};

export default function FraseTeste({ text = "Frase de teste", className = "" }: FraseTesteProps) {
  return (
    <div className={`flex items-center justify-center min-h-screen p-6 bg-gray-50 ${className}`}>
      <div className="max-w-xl w-full text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
        <p className="text-xl md:text-2xl font-semibold text-gray-800">{text}</p>
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={() => navigator.clipboard.writeText(text)}
            className="px-4 py-2 rounded-lg shadow-sm hover:scale-105 transition-transform"
            aria-label="Copiar frase"
          >
            Copiar
          </button>
          <button
            onClick={() => alert(text)}
            className="px-4 py-2 rounded-lg shadow-sm hover:scale-105 transition-transform"
            aria-label="Mostrar alerta"
          >
            Alertar
          </button>
        </div>
      </div>
    </div>
  );
}
