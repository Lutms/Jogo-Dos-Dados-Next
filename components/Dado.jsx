import Image from "next/image";

/**
 * Componente Dado
 * Recebe uma prop `valor` (número de 1 a 6) e exibe a imagem do dado
 * correspondente. Se `valor` for nulo/indefinido, exibe um dado "vazio",
 * indicando que ainda não foi jogado nesta rodada.
 */
export default function Dado({ valor }) {
  if (!valor) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-xl border-4 border-dashed border-slate-400 bg-slate-50 sm:h-20 sm:w-20">
        <span className="text-2xl font-bold text-slate-400">×</span>
      </div>
    );
  }

  return (
    <div className="flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
      <Image
        src={`/dados/${valor}.png`}
        alt={`Dado com o valor ${valor}`}
        width={80}
        height={80}
        priority
      />
    </div>
  );
}
