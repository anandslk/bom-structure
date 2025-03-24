import { Button, Stack, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";

import { useConfirmations } from "src/hooks/useConfirmations";
import { LoadingScreen } from "./LoadingScreen";

export function Dialog({
  children,
  onSubmit,
  onCancel,
  disabled,
  title,
}: {
  children: React.ReactNode;
  disabled: boolean;
  title: string;

  onSubmit: () => void;
  onCancel: () => void;
}) {
  const { isOpen } = useConfirmations();

  return (
    <div className="flex justify-center items-center">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl min-w-[50%] max-w-[80%]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                {title}
              </Typography>

              {disabled && (
                <div className="w-full flex justify-center py-4">
                  <LoadingScreen message="Searching for parts..." />
                </div>
              )}

              {children}

              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                className="border-t border-gray-300 pt-4"
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onSubmit}
                  disabled={disabled}
                >
                  Confirm
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={onCancel}
                  disabled={disabled}
                >
                  Cancel
                </Button>
              </Stack>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
