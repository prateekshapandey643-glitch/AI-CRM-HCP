import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar/Navbar";
import ChatAssistant from "../components/ChatAssistant/ChatAssistant";

import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

// Normalizes AI-returned sentiment (any case) to match the RadioGroup values
const normalizeSentiment = (value) => {
  if (!value) return "Neutral";
  const lower = value.toLowerCase();
  if (lower === "positive") return "Positive";
  if (lower === "negative") return "Negative";
  return "Neutral";
};

// Normalizes AI-returned interaction type (any case) to match the dropdown MenuItem values
const normalizeInteractionType = (value) => {
  if (!value) return "";
  const options = ["Meeting", "Call", "Email", "Conference"];
  const match = options.find(
    (opt) => opt.toLowerCase() === value.toLowerCase()
  );
  return match || "";
};

function LogInteraction() {
  const [hcpName, setHcpName] = useState("");
  const [interactionType, setInteractionType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [attendees, setAttendees] = useState("");
  const [topics, setTopics] = useState("");
  const [sentiment, setSentiment] = useState("Neutral");
  const [outcomes, setOutcomes] = useState("");
  const [followUp, setFollowUp] = useState("");

  // AI Auto-fill handler: called by ChatAssistant with parsed JSON from backend
  const handleGenerate = (data) => {
    if (!data) return;

    setHcpName(data.hcp_name || "");
    setInteractionType(normalizeInteractionType(data.interaction_type));

    setDate(data.interaction_date || "");
    setTime(data.interaction_time || "");

    setLocation(data.location || "");
    setAttendees(data.attendees || "");
    setTopics(data.topics || "");

    setSentiment(normalizeSentiment(data.sentiment));

    setOutcomes(data.outcomes || "");
    setFollowUp(data.follow_up || "");
  };

  const handleSave = async () => {
    const formData = {
      hcpName,
      interactionType,
      date,
      time,
      location,
      attendees,
      topics,
      sentiment,
      outcomes,
      followUp,
    };

    try {
      const response = await api.post("/interactions", formData);

      console.log("Interaction Saved Successfully");
      console.log(response.data);

      alert("Interaction Saved Successfully!");

      // Clear form after successful save
      setHcpName("");
      setInteractionType("");
      setDate("");
      setTime("");
      setLocation("");
      setAttendees("");
      setTopics("");
      setSentiment("Neutral");
      setOutcomes("");
      setFollowUp("");

    } catch (error) {
      console.error("Error saving interaction:", error);

      alert("Failed to save interaction.");
    }
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          fontWeight="bold"
        >
          Log HCP Interaction
        </Typography>

        <Grid container spacing={3}>
          {/* LEFT SIDE */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Grid container spacing={3}>

                {/* HCP Name */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="HCP Name"
                    placeholder="Enter HCP Name"
                    value={hcpName}
                    onChange={(e) =>
                      setHcpName(e.target.value)
                    }
                  />
                </Grid>

                {/* Interaction Type */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Interaction Type"
                    value={interactionType}
                    onChange={(e) =>
                      setInteractionType(e.target.value)
                    }
                  >
                    <MenuItem value="Meeting">
                      Meeting
                    </MenuItem>

                    <MenuItem value="Call">
                      Call
                    </MenuItem>

                    <MenuItem value="Email">
                      Email
                    </MenuItem>

                    <MenuItem value="Conference">
                      Conference
                    </MenuItem>
                  </TextField>
                </Grid>

                {/* Date */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={date}
                    onChange={(e) =>
                      setDate(e.target.value)
                    }
                  />
                </Grid>

                {/* Time */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Time"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={time}
                    onChange={(e) =>
                      setTime(e.target.value)
                    }
                  />
                </Grid>

                {/* Location */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    placeholder="Hospital / Clinic / Online"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                  />
                </Grid>

                {/* Attendees */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Attendees"
                    placeholder="Dr. Sharma, Sales Manager..."
                    value={attendees}
                    onChange={(e) =>
                      setAttendees(e.target.value)
                    }
                  />
                </Grid>

                {/* Topics */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Topics Discussed"
                    placeholder="Discuss the key topics..."
                    value={topics}
                    onChange={(e) =>
                      setTopics(e.target.value)
                    }
                  />
                </Grid>

                {/* Sentiment */}
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    gutterBottom
                  >
                    HCP Sentiment
                  </Typography>

                  <RadioGroup
                    row
                    value={sentiment}
                    onChange={(e) =>
                      setSentiment(e.target.value)
                    }
                  >
                    <FormControlLabel
                      value="Positive"
                      control={<Radio />}
                      label="Positive"
                    />

                    <FormControlLabel
                      value="Neutral"
                      control={<Radio />}
                      label="Neutral"
                    />

                    <FormControlLabel
                      value="Negative"
                      control={<Radio />}
                      label="Negative"
                    />
                  </RadioGroup>
                </Grid>

                {/* Outcomes */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Outcomes"
                    placeholder="Meeting outcome..."
                    value={outcomes}
                    onChange={(e) =>
                      setOutcomes(e.target.value)
                    }
                  />
                </Grid>

                {/* Follow Up */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Follow-up Actions"
                    placeholder="Next action items..."
                    value={followUp}
                    onChange={(e) =>
                      setFollowUp(e.target.value)
                    }
                  />
                </Grid>

                {/* Button */}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSave}
                    sx={{
                      px: 5,
                      py: 1.5,
                      fontWeight: "bold",
                    }}
                  >
                    Save Interaction
                  </Button>
                </Grid>

              </Grid>
            </Paper>
          </Grid>

          {/* RIGHT SIDE */}
          <Grid item xs={12} md={4}>
            <ChatAssistant onGenerate={handleGenerate} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default LogInteraction;