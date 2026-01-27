import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "../../store/appStore";
import { searchAddress } from "../../api/AddressAPI";
import { Input } from "../ui/Input";
import type { AddressResult, NewUbicacionType } from "../../types";

type AddressSearchInputProps = {
    value: string;
    onChange: ({lat, lng}: NewUbicacionType) => void;
}

export default function AddressSearchInput({ value, onChange }: AddressSearchInputProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<AddressResult []>([]);
    const [selected, setSelected] = useState(false);

    const { showMessages } = useAppStore();

    const { mutate, isPending } = useMutation({
        mutationFn: searchAddress,
        onSuccess: (data) => {
            setResults(data);
        },
        onError: (error) => {
            if("messages" in error && Array.isArray(error.messages)) {
                console.log(error.messages);
                error.messages.forEach((error: string) => {
                    showMessages("error", error);
                }); 
            }             
        }
    });

    useEffect(() => {
        setSelected(true);
        setQuery(value);
    }, [value]);

    useEffect(() => {
        if ( query.length < 5 || selected ) return;
    
        const timeout = setTimeout(() => {
            mutate(query);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div className="relative w-full">
            <Input 
                id="ubicacion"
                value={query}
                placeholder="Buscar dirección..."
                onChange={e => {
                    setSelected(false);
                    setQuery(e.target.value);
                }}
                onKeyDown={e => {
                    if(e.key === "Enter") e.preventDefault();
                    if (e.key === "Escape") setResults([]);
                }}
            />

            { isPending && (
                <div
                    className="bg-popover/20 text-popover-foreground backdrop-blur-lg p-1 mt-1 absolute z-50 w-full rounded-lg border shadow-md fade-in"
                >
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                        Buscando direcciones…
                    </div>
                </div>
            )}
                

            { results.length > 0 && (
                <div
                    className="bg-popover/20 text-popover-foreground backdrop-blur-lg p-1 mt-1 absolute z-50 w-full rounded-lg border shadow-md fade-in"
                >
                    <ul 
                        className=" w-full max-h-60 overflow-x-hidden p-1"
                    >  
                        {results.map(item => (
                            <li
                                key={item.place_id}
                                className="px-3 p-1 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm rounded-xl"
                                onClick={() => {
                                    setSelected(true);
                                    setQuery(item.display_name);
                                    setResults([]);
                                    onChange({ 
                                        lat: parseFloat(item.lat), 
                                        lng: parseFloat(item.lon)
                                    });
                                }}
                            >
                                {item.display_name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}