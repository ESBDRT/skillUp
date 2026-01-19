import { useState } from 'react';
import { Search, X, SortAsc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type SortOption = 'strength-asc' | 'strength-desc' | 'next-review' | 'name';

interface ConceptSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortLabels: Record<SortOption, string> = {
  'strength-asc': 'Force ↑',
  'strength-desc': 'Force ↓',
  'next-review': 'Prochaine révision',
  'name': 'Nom A-Z',
};

const ConceptSearch = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: ConceptSearchProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex gap-2">
      {/* Search Input */}
      <div className={`relative flex-1 transition-all ${isFocused ? 'ring-2 ring-primary/50' : ''} rounded-xl`}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher un concept..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-10 pr-10 rounded-xl border-border bg-card"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => onSearchChange('')}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <SortAsc className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {(Object.keys(sortLabels) as SortOption[]).map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => onSortChange(option)}
              className={sortBy === option ? 'bg-primary/10 text-primary' : ''}
            >
              {sortLabels[option]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ConceptSearch;
