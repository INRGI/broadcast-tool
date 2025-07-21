import { useEffect, useMemo, useState } from "react";
import AdminModal from "../../Common/AdminModal";
import { Container, LoadingContainer } from "./BroadcastSendsModal.styled";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Autocomplete,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Grid } from "@mui/material";
import Loader from "../../Common/Loader";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import { getBroadcastSendsById } from "../../../api/broadcast.api";
import { GetBroadcastsSendsResponseDto } from "../../../api/broadcast";

interface BroadcastSendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  broadcastRulesId: string;
}
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    primary: {
      main: "#6a5acd",
    },
    text: {
      primary: "#ffffff",
      secondary: "#aaaaaa",
    },
  },
});

const BroadcastSendsModal: React.FC<BroadcastSendsModalProps> = ({
  isOpen,
  onClose,
  broadcastRulesId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [broadcastsSends, setBroadcastsSends] =
    useState<GetBroadcastsSendsResponseDto | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedPartner, setSelectedPartner] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<string>("All");

  useEffect(() => {
    setIsLoading(true);

    Promise.allSettled([getBroadcastSends(broadcastRulesId)]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (broadcastsSends?.broadcasts[0].result.length && !selectedDate) {
      setSelectedDate(
        broadcastsSends.broadcasts[0].result[
          broadcastsSends.broadcasts[0].result.length - 1
        ].date
      );
    }
  }, [broadcastsSends]);

  const getBroadcastSends = async (broadcastRulesId: string) => {
    try {
      const response = await getBroadcastSendsById(broadcastRulesId);
      if (!response) throw new Error("Failed to get broadcast sends");
      setBroadcastsSends(response);
      toastSuccess("Broadcast sends fetched successfully");
    } catch (error) {
      toastError("Failed to get broadcast sends");
    }
  };

  const availableDates = useMemo(() => {
    return broadcastsSends?.broadcasts[0].result.map((d) => d.date) || [];
  }, [broadcastsSends]);

  const allPartners = useMemo(() => {
    if (!broadcastsSends) return ["All"];
    const set = new Set<string>();
    broadcastsSends.broadcasts[0].result.forEach((d) =>
      d.partners.forEach((p) => set.add(p.partner))
    );
    return ["All", ...Array.from(set)];
  }, [broadcastsSends]);

  const allProducts = useMemo(() => {
    if (!broadcastsSends || selectedPartner === "All") return ["All"];
    const productSet = new Set<string>();
    broadcastsSends.broadcasts[0].result.forEach((day) => {
      day.partners
        .filter((p) => p.partner === selectedPartner)
        .forEach((p) => {
          p.products.forEach((prod) => productSet.add(prod.product));
        });
    });
    return ["All", ...Array.from(productSet)];
  }, [broadcastsSends, selectedPartner]);

  const chartData = useMemo(() => {
    if (!broadcastsSends) return [];

    const day = broadcastsSends.broadcasts[0]?.result.find(
      (d) => d.date === selectedDate
    );
    if (!day) return [];

    const entries: { copy: string; sends: number; partner: string }[] = [];

    day.partners.forEach((p) => {
      if (selectedPartner !== "All" && p.partner !== selectedPartner) return;

      p.products.forEach((prod) => {
        if (selectedProduct !== "All" && prod.product !== selectedProduct)
          return;

        prod.copies.forEach((copy) => {
          entries.push({
            copy: copy.copy,
            sends: copy.sends,
            partner: p.partner,
          });
        });
      });
    });

    return entries;
  }, [broadcastsSends, selectedPartner, selectedProduct, selectedDate]);

  const partnerStats = useMemo(() => {
    if (!broadcastsSends) return [];
    const map = new Map<
      string,
      { sends: number; products: Record<string, number> }
    >();
    broadcastsSends.broadcasts[0].result.forEach((day) => {
      day.partners.forEach((p) => {
        const existing = map.get(p.partner) || { sends: 0, products: {} };
        existing.sends += p.sends;
        p.products.forEach((prod) => {
          existing.products[prod.product] =
            (existing.products[prod.product] || 0) + prod.sends;
        });
        map.set(p.partner, existing);
      });
    });
    return Array.from(map.entries()).map(([name, stat]) => ({ name, ...stat }));
  }, [broadcastsSends]);

  const partnerColors = useMemo(() => {
    const partners = new Set(chartData.map((e) => e.partner));
    const palette = ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56", "#2ecc71"];
    const map: Record<string, string> = {};
    Array.from(partners).forEach((p, i) => {
      map[p] = palette[i % palette.length];
    });
    return map;
  }, [chartData]);

  const series = Array.from(new Set(chartData.map((e) => e.partner))).map(
    (partner) => ({
      dataKey: partner,
      label: partner,
      color: partnerColors[partner],
    })
  );

  const grouped = chartData.reduce((acc, curr) => {
    if (!acc[curr.copy]) acc[curr.copy] = { copy: curr.copy };
    acc[curr.copy][curr.partner] = curr.sends;
    return acc;
  }, {} as Record<string, any>);

  const dataset = Object.values(grouped);

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      {isLoading ? (
        <LoadingContainer>
          <Loader />
        </LoadingContainer>
      ) : !broadcastsSends ? (
        <Container>
          <Card sx={{ m: 3, p: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No broadcast data available.
            </Typography>
          </Card>
        </Container>
      ) : (
        <Container>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box sx={{ p: 0 }}>
              <Grid container spacing={3}>
                <Grid
                  component={Card}
                  width={Math.max(
                    document.body.clientWidth - 20
                  )}
                >
                  <Card>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Broadcast Chart
                      </Typography>

                      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                        <Autocomplete
                          options={allPartners}
                          value={selectedPartner}
                          onChange={(_, v) => {
                            if (v) {
                              setSelectedPartner(v);
                              setSelectedProduct("All");
                            }
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="Partner" />
                          )}
                          fullWidth
                        />

                        <Autocomplete
                          options={allProducts}
                          value={selectedProduct}
                          onChange={(_, v) => {
                            if (v) setSelectedProduct(v);
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="Product" />
                          )}
                          fullWidth
                        />

                        <Autocomplete
                          options={availableDates}
                          value={selectedDate}
                          onChange={(_, v) => v && setSelectedDate(v)}
                          renderInput={(params) => (
                            <TextField {...params} label="Date" />
                          )}
                          fullWidth
                        />
                      </Box>

                      <Box
                        sx={{
                          maxHeight: 600,
                          overflowX: "auto",
                          width: "100%",
                          minWidth: "800px",
                        }}
                      >
                        <BarChart
                          key={dataset.length}
                          layout="vertical"
                          dataset={dataset}
                          xAxis={[
                            {
                              scaleType: "band",
                              dataKey: "copy",
                              barGapRatio: 0.2,
                              labelStyle: {
                                fontSize: 12,
                                angle: 0,
                                textAnchor: "end",
                              },
                            },
                          ]}
                          yAxis={[
                            {
                              valueFormatter: (v: number) => `${Math.round(v)}`,
                              tickMinStep: 1,
                            },
                          ]}
                          series={series}
                          height={400}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid component={Card}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Partner Breakdown
                      </Typography>

                      {partnerStats.map((partner) => (
                        <Accordion key={partner.name}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>
                              {partner.name} — {partner.sends} sends
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {Object.entries(partner.products).map(
                              ([product, count]) => (
                                <Typography key={product} sx={{ pl: 1 }}>
                                  • {product}: {count}
                                </Typography>
                              )
                            )}
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </ThemeProvider>
        </Container>
      )}
    </AdminModal>
  );
};

export default BroadcastSendsModal;
