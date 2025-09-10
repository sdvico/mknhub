import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router";

interface SearchField {
  value: string;
  label: string;
}

interface SearchBarProps {
  fields: SearchField[];
  placeholder?: string;
  onSearch?: (query: string, field: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  fields,
  placeholder = "Search...",
  onSearch,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState(fields[0]?.value || "");

  // Initialize search from URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get("q");
    const field = searchParams.get("field");

    if (q) {
      setSearchQuery(q);
    }
    if (field && fields.some((f) => f.value === field)) {
      setSelectedField(field);
    }
  }, [location.search, fields]);

  const handleSearch = (query: string, field: string) => {
    const searchParams = new URLSearchParams(location.search);

    if (query.trim()) {
      searchParams.set("q", query.trim());
      searchParams.set("field", field);
    } else {
      searchParams.delete("q");
      searchParams.delete("field");
    }

    // Reset to first page when searching
    searchParams.delete("page");

    const newSearch = searchParams.toString();
    const newUrl = newSearch
      ? `${location.pathname}?${newSearch}`
      : location.pathname;

    navigate(newUrl, { replace: true });

    if (onSearch) {
      onSearch(query.trim(), field);
    }
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    handleSearch(query, selectedField);
  };

  const handleFieldChange = (event: any) => {
    const field = event.target.value;
    setSelectedField(field);
    handleSearch(searchQuery, field);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleQueryChange}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                borderRadius: 999,
              },
            }}
          />
        </Grid>
        {fields && fields.length > 0 ? (
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Search Field</InputLabel>
              <Select
                value={selectedField}
                label="Search Field"
                onChange={handleFieldChange}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 2,
                }}
              >
                {fields.map((field) => (
                  <MenuItem key={field.value} value={field.value}>
                    {field.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ) : null}
      </Grid>
    </Box>
  );
};
