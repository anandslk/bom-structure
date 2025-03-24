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
import { Dialog } from "./components/Dialog";
import { useConfirmations } from "./hooks/useConfirmations";
import {
  useOrgListQuery,
  usePostMutation,
  useRdoListQuery,
} from "./slices/apis/app.api";
import toast from "react-hot-toast";
import { getErrorMessage } from "./slices/apis/types";

interface FormErrors {
  parentParts?: string;
  sourceOrg?: string;
}

type Stage = "form" | "searching" | "confirmation" | "assigning" | "results";

export const App: React.FC = () => {
  // Form fields and error state
  const [errors, setErrors] = useState<FormErrors>({
    parentParts: "",
    sourceOrg: "",
  });

  type IFormState = {
    parentParts: string;
    sourceOrg: string;
    plants: string[];
  };

  const [formState, setFormState] = useState<IFormState>({
    parentParts: "",
    sourceOrg: "",
    plants: [],
  });

  const handleChange = (
    key: keyof IFormState,
    value: IFormState[keyof IFormState]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const { setIsOpen } = useConfirmations();

  // Track submission stage
  const [stage, setStage] = useState<Stage>("form");

  // --- Form Submission ---
  const handleFormSubmit = (): void => {
    const newErrors: FormErrors = {};

    if (!formState.parentParts.trim())
      newErrors.parentParts = "Parent Part is required";
    if (!formState.sourceOrg.trim())
      newErrors.sourceOrg = "Source org is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsOpen(true);
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
    setIsOpen(false);
  };

  const [postMutation, { isLoading }] = usePostMutation();

  // --- Confirmation Stage ---
  const handleConfirmationSubmit = async () => {
    const { data, error } = await postMutation({
      parentPart: formState.parentParts,
      sourceOrg: formState.sourceOrg,
      plants: formState.plants,
    });

    if (error) toast.error(getErrorMessage(error));

    setIsOpen(false);
    toast.success(data.message);
  };

  // --- Assigning Stage ---
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (stage === "assigning") {
      timer = setTimeout(() => {
        setStage("results");
        console.log("Final submission:", {
          parentParts: formState.parentParts,
          sourceOrg: formState.sourceOrg,
          selectedItems: formState.plants,
        });
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [stage, formState.parentParts, formState.sourceOrg, formState.plants]);

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

      <Dialog
        title="Confirm Your Submission"
        onSubmit={handleConfirmationSubmit}
        onCancel={handleCancel}
        disabled={isLoading}
      >
        <ConfirmationScreen
          stage={stage}
          parentParts={formState.parentParts}
          sourceOrg={formState.sourceOrg}
          destOrg="AY5"
          partsProcessed="575757-676"
          selectedItems={formState.plants}
        />
      </Dialog>

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
                value={formState.parentParts}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange("parentParts", e.target.value)
                }
                error={!!errors.parentParts}
                helperText={errors.parentParts}
                fullWidth
                disabled={stage === "searching"}
              />
              <TextField
                label="Source Organization"
                variant="outlined"
                value={formState.sourceOrg}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange("sourceOrg", e.target.value)
                }
                error={!!errors.sourceOrg}
                helperText={errors.sourceOrg}
                fullWidth
                disabled={stage === "searching"}
              />

              <DropdownMultiSelect
                selectedItems={formState.plants}
                onChange={(newSelectedItems) =>
                  handleChange("plants", newSelectedItems)
                }
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
            parentParts={formState.parentParts}
            sourceOrg={formState.sourceOrg}
            destOrg="AY5"
            partsProcessed="575757-676"
            selectedItems={formState.plants}
            // onSubmit={handleConfirmationSubmit}
            // onCancel={handleCancel}
          />
        )}

        {/* Results Screen */}
        {stage === "results" && (
          <ResultsScreen
            parentParts={formState.parentParts}
            sourceOrg={formState.sourceOrg}
            selectedItems={formState.plants}
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
  const handleSelect = (newValue: string | null): void => {
    if (newValue && !selectedItems?.includes(newValue)) {
      onChange([...selectedItems, newValue]);
    }
  };

  const handleDelete = (itemToDelete: string): void => {
    onChange(selectedItems?.filter((item) => item !== itemToDelete));
  };

  const { data: rdoList } = useRdoListQuery({});
  const { data: orgList } = useOrgListQuery({});

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Autocomplete
        options={rdoList?.data ?? []}
        onChange={(_, newValue) => handleSelect(newValue as string)}
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
        options={orgList?.data ?? []}
        onChange={(_, newValue) => handleSelect(newValue as string)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select an Org (will appear in Selected Plants)"
            fullWidth
            variant="outlined"
            disabled={disabled}
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
