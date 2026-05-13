import React, { useState, useRef } from 'react';
import { ImagePlus, HardDriveUpload, Loader2 } from 'lucide-react';

export default function ImageTool({ onAddImage }) {
    const [uploading, setUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const processFile = async (file) => {
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            alert("La imagen no puede superar los 10MB");
            return;
        }
        setUploading(true);
        try {
            await onAddImage(file);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error al subir la imagen");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleFileChange = (e) => processFile(e.target.files[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        processFile(e.dataTransfer.files[0]);
    };

    return (
        <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3 bg-gradient-to-r from-red-600/10 to-transparent">
                <div className="p-1.5 bg-red-600/20 rounded-lg border border-red-500/20">
                    <ImagePlus size={14} className="text-red-400" strokeWidth={2.5} />
                </div>
                <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em] font-['Outfit']">
                    Subir Imagen / Logo
                </h3>
            </div>

            <div className="p-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <button
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    disabled={uploading}
                    className={`w-full h-28 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all group ${
                        isDragOver
                            ? 'border-red-500/70 bg-red-500/5'
                            : uploading
                                ? 'border-white/5 opacity-60 cursor-not-allowed'
                                : 'border-white/8 hover:border-red-500/40 hover:bg-red-500/3 cursor-pointer'
                    }`}
                >
                    {uploading ? (
                        <>
                            <Loader2 size={24} className="text-red-500 animate-spin" strokeWidth={3} />
                            <span className="text-[9px] text-red-400 font-black uppercase tracking-widest">
                                Subiendo...
                            </span>
                        </>
                    ) : (
                        <>
                            <div className={`p-2 rounded-xl transition-colors ${isDragOver ? 'bg-red-500/20' : 'bg-white/5 group-hover:bg-red-500/10'}`}>
                                <HardDriveUpload size={18} className={`transition-colors ${isDragOver ? 'text-red-400' : 'text-gray-500 group-hover:text-red-400'}`} strokeWidth={2.5} />
                            </div>
                            <div className="text-center">
                                <p className="text-[9px] text-gray-400 group-hover:text-white font-black uppercase tracking-widest transition-colors">
                                    Haz click o arrastra aquí
                                </p>
                                <p className="text-[8px] text-gray-600 mt-1">
                                    JPG · PNG · WEBP · SVG · Máx 10MB
                                </p>
                            </div>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
