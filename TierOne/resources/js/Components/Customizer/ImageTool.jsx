import React, { useState, useRef } from 'react';
import { ImagePlus, Plus, Loader2 } from 'lucide-react';

export default function ImageTool({ onAddImage }) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
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
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <h3 className="text-white font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                <ImagePlus size={14} className="text-pink-400" />
                Añadir Imagen
            </h3>
            
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={`w-full h-24 border-2 border-dashed border-white/10 hover:border-pink-500/50 hover:bg-pink-500/5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {uploading ? (
                    <>
                        <Loader2 size={24} className="text-pink-500 animate-spin" />
                        <span className="text-[9px] text-pink-500 font-black uppercase tracking-widest">Subiendo...</span>
                    </>
                ) : (
                    <>
                        <Plus size={20} className="text-gray-500 group-hover:text-pink-500 transition-colors" />
                        <span className="text-[9px] text-gray-500 group-hover:text-pink-500 font-black uppercase tracking-widest transition-colors text-center px-4">
                            Subir imagen (máx 10MB)
                        </span>
                    </>
                )}
            </button>
            <p className="text-[9px] text-gray-500 mt-3 text-center italic">Formatos: JPG, PNG, WEBP, SVG</p>
        </div>
    );
}
