import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CustomAccordion = ({ title, content, disabled }) => {
  return (
    <Accordion disabled={disabled}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-content" id="panel-header">
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {content}
      </AccordionDetails>
    </Accordion>
  );
};

export default CustomAccordion;