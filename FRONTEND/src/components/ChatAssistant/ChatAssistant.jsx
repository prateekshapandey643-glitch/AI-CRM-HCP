import { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

function ChatAssistant({ onGenerate }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const generateForm = async () => {
    if (!text.trim()) {
      alert("Please enter interaction details.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/generate-form",
        {
          text,
        }
      );

      console.log(res.data);

      if (onGenerate) {
        onGenerate(res.data);
      }

      alert("AI generated the form successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to generate form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, height: "100%" }}>
      <Typography variant="h5" gutterBottom>
        AI Assistant
      </Typography>

      <Typography variant="body2" sx={{ mb: 2 }}>
        Describe the interaction in natural language.
      </Typography>

      <TextField
        multiline
        rows={12}
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Example:

Met Dr. Sharma today.

Discussed Product X.

Doctor showed positive interest.

Requested brochure.

Follow-up after two weeks.`}
      />

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={generateForm}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Form"}
      </Button>
    </Paper>
  );
}

export default ChatAssistant;