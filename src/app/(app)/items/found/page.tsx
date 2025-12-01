"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import ItemCard from "@/components/item-card";
import { foundItems as allFoundItems } from "@/lib/data";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FoundItem } from "@/lib/types";
import { getSmartSearchSuggestions } from "@/ai/flows/smart-search-suggestions";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

const categories = ["All", "Electronics", "Accessories", "Clothing", "Documents", "Keys", "Other"];
const sortOptions = [
  { value: "newest", label: "Date Found (Newest)" },
  { value: "oldest", label: "Date Found (Oldest)" },
];

export default function BrowseFoundItemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const getSuggestions = useCallback(async () => {
    if (debouncedSearchTerm.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsSuggestionsLoading(true);
    try {
      const result = await getSmartSearchSuggestions({ query: debouncedSearchTerm });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Failed to get search suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsSuggestionsLoading(false);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    getSuggestions();
  }, [getSuggestions]);

  const filteredAndSortedItems = useMemo(() => {
    let items: FoundItem[] = [...allFoundItems];

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(lowercasedTerm) ||
          item.description.toLowerCase().includes(lowercasedTerm) ||
          item.category.toLowerCase().includes(lowercasedTerm) ||
          item.location.toLowerCase().includes(lowercasedTerm)
      );
    }

    if (categoryFilter !== "All") {
      items = items.filter((item) => item.category === categoryFilter);
    }

    items.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return items;
  }, [searchTerm, categoryFilter, sortBy]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Browse Found Items</h1>
        <p className="text-muted-foreground">
          Search through items that have been reported as found.
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by keyword, e.g., 'black wallet'"
            className="w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
           {searchTerm && (
             <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
           )}
          {suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full rounded-md border bg-card shadow-lg z-10">
              <p className="p-2 text-sm font-semibold text-muted-foreground">Smart Suggestions</p>
              <ul className="py-1">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAndSortedItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
       {filteredAndSortedItems.length === 0 && (
        <div className="text-center py-16 col-span-full">
            <p className="text-muted-foreground">No items found matching your criteria.</p>
        </div>
       )}
    </div>
  );
}
