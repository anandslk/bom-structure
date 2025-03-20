import React, { useState, ChangeEvent } from "react";
import {
  Autocomplete,
  TextField,
  Chip,
  Box,
  Paper,
  Button,
  Stack,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";

interface FormErrors {
  parentParts: boolean;
  sourceOrg: boolean;
}

const options1: string[] = [
  "apple",
  "zebra",
  "moonlight",
  "ocean",
  "firestorm",
  "quantum",
  "nebula",
  "phantom",
  "velocity",
  "echo",
  "cascade",
  "lunar",
  "specter",
  "blizzard",
  "gravity",
  "vortex",
  "solar",
  "tundra",
  "mirage",
  "obsidian",
  "ember",
  "thunder",
  "cosmos",
  "horizon",
  "radiance",
  "eclipse",
  "serenity",
  "tempest",
  "whisper",
  "glimmer",
];

const options2: string[] = [...options1];

export const App: React.FC = () => {
  const [parentParts, setParentParts] = useState<string>("");
  const [sourceOrg, setSourceOrg] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({
    parentParts: false,
    sourceOrg: false,
  });

  const handleSubmit = (): void => {
    const newErrors: FormErrors = {
      parentParts: parentParts.trim() === "",
      sourceOrg: sourceOrg.trim() === "",
    };
    setErrors(newErrors);
    if (!newErrors.parentParts && !newErrors.sourceOrg) {
      console.log("Form submitted:", { parentParts, sourceOrg });
    }
  };

  const handleCancel = (): void => {
    setParentParts("");
    setSourceOrg("");
    setErrors({ parentParts: false, sourceOrg: false });
    console.log("Form cancelled");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#eef2f6" }}>
      <AppBar position="static" sx={{ backgroundColor: "#3f51b5" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              margin: "auto",
            }}
          >
            Assign BOM Structure to Specific Orgs
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          padding: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 150px)",
        }}
      >
        <Paper
          sx={{
            padding: 4,
            width: "100%",
            maxWidth: 600,
            borderRadius: 4,
            boxShadow: 3,
          }}
        >
          <Stack spacing={3}>
            <TextField
              label="Parent Parts to Assign"
              variant="outlined"
              value={parentParts}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setParentParts(e.target.value)
              }
              error={errors.parentParts}
              helperText={errors.parentParts ? "This field is required" : ""}
              fullWidth
            />
            <TextField
              label="Source Organization"
              variant="outlined"
              value={sourceOrg}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSourceOrg(e.target.value)
              }
              error={errors.sourceOrg}
              helperText={errors.sourceOrg ? "This field is required" : ""}
              fullWidth
            />

            <DropdownMultiSelect />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default App;

const DropdownMultiSelect: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [firstDropdownSelected, setFirstDropdownSelected] =
    useState<boolean>(false);

  const handleSelect = (
    newValue: string | null,
    dropdownType: "first" | "second"
  ): void => {
    if (newValue && !selectedItems.includes(newValue)) {
      setSelectedItems([...selectedItems, newValue]);
    }
    if (dropdownType === "first" && newValue) {
      setFirstDropdownSelected(true);
    }
  };

  const handleDelete = (itemToDelete: string): void => {
    setSelectedItems(selectedItems.filter((item) => item !== itemToDelete));
  };

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Autocomplete
        options={options1}
        onChange={(_, newValue) => handleSelect(newValue, "first")}
        renderInput={(params) => (
          <TextField
            {...params}
            label="JDI RDO List"
            fullWidth
            variant="outlined"
          />
        )}
      />
      <Autocomplete
        options={options2}
        onChange={(_, newValue) => handleSelect(newValue, "second")}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select an Org"
            fullWidth
            variant="outlined"
          />
        )}
        disabled={!firstDropdownSelected}
      />
      <Paper
        sx={{
          padding: 2,
          borderRadius: 2,
          boxShadow: 2,
          maxHeight: 200,
          overflowY: "auto",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Mapped Parent Parts & Organizations
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {selectedItems.map((item) => (
            <Chip
              key={item}
              label={item}
              onDelete={() => handleDelete(item)}
              color="primary"
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};
