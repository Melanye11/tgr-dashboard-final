export default function ErrorView({ titulo, mensaje}) {
    return (
        <div className="flex h-[60vh] items-center justify-center text-center p-6"> 
            <div>
                <h2 className="text-2xl font-bold  text-slate-800 mb-2">{titulo}</h2>
                <p className="text-slate-600">{mensaje}</p>
            </div>
        </div>
    );
}