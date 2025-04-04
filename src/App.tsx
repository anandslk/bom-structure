import React, { useState, useEffect, ChangeEvent } from "react";
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
import { LoadingScreen } from "./components/LoadingScreen";
import { ConfirmationScreen } from "./components/Confirmation";
import { ResultsScreen } from "./components/Result";

interface FormErrors {
  parentParts: boolean;
  sourceOrg: boolean;
}

const RDOList: string[] = [
  "FSA",
  "AO1",
  "MIA",
  "VLO",
  "MEE",
  "AT1",
  "AZ5",
  "BES",
  "SOC",
  "EWK",
  "STG",
  "PDS",
  "CG1",
  "HRS",
  "CZ1",
  "DK1",
  "EY1",
  "FS1",
  "FRS",
  "GA1",
  "DE1",
  "GB1",
  "HAC",
  "IQ1",
  "IE1",
  "ITS",
  "JPS",
  "SEE",
  "KW1",
  "SBD",
  "SBG",
  "CDC",
  "EDO",
  "HJH",
  "LRD",
  "VHS",
  "RGA",
  "MO1",
  "NL1",
  "NZE",
  "NG1",
  "LKS",
  "LIM",
  "PMI",
  "PS0",
  "PT1",
  "QA1",
  "RUS",
  "RO1",
  "SA1",
  "DTV",
  "SG3",
  "SGC",
  "SGD",
  "SK1",
  "ES1",
  "SE1",
  "CHS",
  "AY5",
  "RAE",
  "TRS",
  "AD1",
  "DX1",
  "HCE",
];

const orgList: string[] = [
  "AD1",
  "AO1",
  "AT1",
  "AY5",
  "AZ5",
  "BES",
  "CDC",
  "CHS",
  "CG1",
  "CST",
  "CZ1",
  "DE1",
  "DES",
  "DK1",
  "DTV",
  "DX1",
  "EDO",
  "ES1",
  "EWK",
  "EY1",
  "FRS",
  "FS1",
  "FSA",
  "GA1",
  "GB1",
  "GB5",
  "HAC",
  "HCE",
  "HJH",
  "HRS",
  "IE1",
  "IES",
  "IQ1",
  "ITS",
  "JPS",
  "KW1",
  "LIM",
  "LKS",
  "LRD",
  "MEE",
  "MIA",
  "MO1",
  "NG1",
  "NL1",
  "NS1",
  "NZE",
  "PDS",
  "PMI",
  "PS0",
  "PT1",
  "QA1",
  "RAE",
  "RGA",
  "RO1",
  "RUS",
  "S04",
  "S05",
  "S08",
  "S13",
  "SA1",
  "SBD",
  "SBG",
  "SE1",
  "SEE",
  "SG3",
  "SGC",
  "SGD",
  "SJN",
  "SK1",
  "SOC",
  "SOR",
  "STG",
  "TOR",
  "TRS",
  "VHS",
  "VLO",
];

type Stage = "form" | "searching" | "confirmation" | "assigning" | "results";

export const App: React.FC = () => {
  // Form fields and error state
  const [parentParts, setParentParts] = useState<string>("");
  const [sourceOrg, setSourceOrg] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({
    parentParts: false,
    sourceOrg: false,
  });

  // State for multi-select items
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Track submission stage
  const [stage, setStage] = useState<Stage>("form");

  // --- Form Submission ---
  const handleFormSubmit = (): void => {
    const newErrors: FormErrors = {
      parentParts: parentParts.trim() === "",
      sourceOrg: sourceOrg.trim() === "",
    };
    setErrors(newErrors);
    if (!newErrors.parentParts && !newErrors.sourceOrg) {
      setStage("searching");
    }
  };

  // --- Searching Stage ---
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (stage === "searching") {
      timer = setTimeout(() => {
        setStage("confirmation");
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [stage]);

  // --- Cancel Handler ---
  const handleCancel = (): void => {
    setParentParts("");
    setSourceOrg("");
    setErrors({ parentParts: false, sourceOrg: false });
    setSelectedItems([]);
    setStage("form");
    console.log("Process cancelled");
  };

  // --- Confirmation Stage ---
  const handleConfirmationSubmit = (): void => {
    setStage("assigning");
  };

  // --- Assigning Stage ---
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (stage === "assigning") {
      timer = setTimeout(() => {
        setStage("results");
        console.log("Final submission:", {
          parentParts,
          sourceOrg,
          selectedItems,
        });
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [stage, parentParts, sourceOrg, selectedItems]);

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
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          minHeight: "calc(100vh - 200px)",
        }}
      >
        {/* Loader for Searching Stage */}
        {stage === "searching" && (
          <LoadingScreen message="Searching for parts..." />
        )}

        {/* Show form if stage is "form" or "searching" */}
        {(stage === "form" || stage === "searching") && (
          <Paper
            sx={{
              padding: 4,
              width: "100%",
              maxWidth: 600,
              borderRadius: 4,
              boxShadow: 3,
              opacity: stage === "searching" ? 0.6 : 1,
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
                disabled={stage === "searching"}
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
                disabled={stage === "searching"}
              />

              <DropdownMultiSelect
                selectedItems={selectedItems}
                onChange={setSelectedItems}
                disabled={stage === "searching"}
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFormSubmit}
                  disabled={stage === "searching"}
                >
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancel}
                  disabled={stage === "searching"}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Paper>
        )}

        {/* Loader for Assigning Stage (same style as Searching Stage) */}
        {stage === "assigning" && (
          <LoadingScreen message="Assigning items and commoning required parts..." />
        )}

        {/* Confirmation Screen */}
        {(stage === "confirmation" || stage === "assigning") && (
          <ConfirmationScreen
            stage={stage}
            parentParts={parentParts}
            sourceOrg={sourceOrg}
            destOrg="AY5"
            partsProcessed="575757-676"
            selectedItems={selectedItems}
            onSubmit={handleConfirmationSubmit}
            onCancel={handleCancel}
          />
        )}

        {/* Results Screen */}
        {stage === "results" && (
          <ResultsScreen
            parentParts={parentParts}
            sourceOrg={sourceOrg}
            selectedItems={selectedItems}
            onBack={handleCancel}
          />
        )}
      </Box>
    </Box>
  );
};

export default App;

interface DropdownProps {
  selectedItems: string[];
  onChange: (items: string[]) => void;
  disabled: boolean;
}

const DropdownMultiSelect: React.FC<DropdownProps> = ({
  selectedItems,
  onChange,
  disabled,
}) => {
  const [firstDropdownSelected, setFirstDropdownSelected] =
    useState<boolean>(false);

  const handleSelect = (
    newValue: string | null,
    dropdownType: "first" | "second",
  ): void => {
    if (newValue && !selectedItems.includes(newValue)) {
      onChange([...selectedItems, newValue]);
    }
    if (dropdownType === "first" && newValue) {
      setFirstDropdownSelected(true);
    }
  };

  const handleDelete = (itemToDelete: string): void => {
    onChange(selectedItems.filter((item) => item !== itemToDelete));
  };

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Autocomplete
        options={RDOList}
        onChange={(_, newValue) => handleSelect(newValue, "first")}
        renderInput={(params) => (
          <TextField
            {...params}
            label="JDI RDO List (will appear in Selected Plants)"
            fullWidth
            variant="outlined"
            disabled={disabled}
          />
        )}
      />
      <Autocomplete
        options={orgList}
        onChange={(_, newValue) => handleSelect(newValue, "second")}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select an Org (will appear in Selected Plants)"
            fullWidth
            variant="outlined"
            disabled={disabled || !firstDropdownSelected}
          />
        )}
      />

      {/* Helper text indicating both selections will be shown */}
      <Typography variant="caption" color="textSecondary">
        Selections from both fields will appear below.
      </Typography>

      <Paper
        sx={{
          padding: 2,
          borderRadius: 2,
          boxShadow: 2,
          maxHeight: 200,
          overflowY: "auto",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", marginBottom: 2 }}
        >
          Selected Plants
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, minHeight: 20 }}>
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
