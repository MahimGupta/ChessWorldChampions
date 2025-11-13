import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import type { Champion } from "@shared/schema";
import Fuse from "fuse.js";
import { useLocation } from "wouter";

interface SearchBarProps {
  champions: Champion[];
}

export function SearchBar({ champions }: SearchBarProps) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<Champion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const fuse = new Fuse(champions, {
    keys: ["name", "id"],
    threshold: 0.3,
  });

  useEffect(() => {
    if (value.trim().length > 0) {
      const results = fuse.search(value.trim());
      setSuggestions(results.map(result => result.item).slice(0, 5));
      setIsOpen(results.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (champion: Champion) => {
    setLocation(`/champion/${champion.id}`);
    setValue("");
    setIsOpen(false);
  };

  const clearSearch = () => {
    setValue("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
        <Input
          type="text"
          placeholder="Search champions..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => value.trim() && setIsOpen(true)}
          className="pl-9 pr-9"
          data-testid="input-search"
        />
        {value && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-clear-search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 overflow-hidden shadow-neon">
          <div className="max-h-[300px] overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSelect(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors border-l-2 border-primary/50 hover:border-primary flex flex-col gap-1"
                data-testid={`suggestion-${suggestion.id}`}
              >
                <div className="font-display text-sm">{suggestion.name}</div>
                <div className="text-xs text-muted-foreground">World Champion #{suggestion.id}</div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
