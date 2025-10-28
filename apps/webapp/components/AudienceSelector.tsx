"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Database } from "../lib/database.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Audience = Database["public"]["Tables"]["audiences"]["Row"];

interface AudienceSelectorProps {
  onAudienceSelect: (audience: Audience) => void;
}

export default function AudienceSelector({
  onAudienceSelect,
}: AudienceSelectorProps) {
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudiences = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("audiences")
        .select("*")
        .order("audience_name", { ascending: true });

      if (fetchError) {
        console.error("Error fetching audiences:", fetchError);
        setError("Failed to load audiences. Please refresh the page.");
      } else if (data) {
        setAudiences(data);
        console.log(`Loaded ${data.length} audiences from Supabase`);
      }
      setLoading(false);
    };

    fetchAudiences();
  }, []);

  const handleChange = (value: string) => {
    const id = parseInt(value, 10);
    const selected = audiences.find((aud) => aud.id === id);
    if (selected) {
      onAudienceSelect(selected);
      setSelectedId(value);
    }
  };

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading audiences...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (audiences.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No audiences available. Please check your Supabase connection.
      </div>
    );
  }

  return (
    <Select value={selectedId} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an Audience Persona" />
      </SelectTrigger>
      <SelectContent>
        {audiences.map((audience) => (
          <SelectItem key={audience.id} value={audience.id.toString()}>
            {audience.audience_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
