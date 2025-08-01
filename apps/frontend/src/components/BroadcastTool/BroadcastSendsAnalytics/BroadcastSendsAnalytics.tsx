import React, { useEffect, useMemo, useState } from "react";
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
import { GetBroadcastsSendsResponseDto } from "../../../api/broadcast";

interface Props {
  data: GetBroadcastsSendsResponseDto;
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

const BroadcastSendsAnalytics: React.FC<Props> = ({ data }) => {
  const [selectedBroadcast, setSelectedBroadcast] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedPartner, setSelectedPartner] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<string>("All");

  const broadcasts = useMemo(() => {
    return Array.isArray(data.broadcasts)
      ? data.broadcasts.filter((b) => b?.result?.length)
      : [];
  }, [data]);

  const activeBroadcasts = useMemo(() => {
    if (selectedBroadcast === "All") return broadcasts;
    return broadcasts.filter((b) => b.name === selectedBroadcast);
  }, [broadcasts, selectedBroadcast]);

  const availableDates = useMemo(() => {
    const dateSet = new Set<string>();
    activeBroadcasts.forEach((b) =>
      b.result.forEach((r) => dateSet.add(r.date))
    );
    return Array.from(dateSet);
  }, [activeBroadcasts]);

  const allPartners = useMemo(() => {
    const set = new Set<string>();
    activeBroadcasts.forEach((b) =>
      b.result.forEach((d) => d.partners.forEach((p) => set.add(p.partner)))
    );
    return ["All", ...Array.from(set)];
  }, [activeBroadcasts]);

  const allProducts = useMemo(() => {
    if (selectedPartner === "All") return ["All"];
    const set = new Set<string>();
    activeBroadcasts.forEach((b) =>
      b.result.forEach((d) =>
        d.partners
          .filter((p) => p.partner === selectedPartner)
          .forEach((p) => p.products.forEach((prod) => set.add(prod.product)))
      )
    );
    return ["All", ...Array.from(set)];
  }, [activeBroadcasts, selectedPartner]);

  const chartData = useMemo(() => {
    if (!selectedDate) return [];

    const entries: { copy: string; sends: number; partner: string }[] = [];

    activeBroadcasts.forEach((b) => {
      const day = b.result.find((d) => d.date === selectedDate);
      if (!day) return;

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
    });

    return entries;
  }, [activeBroadcasts, selectedPartner, selectedProduct, selectedDate]);

  const partnerStats = useMemo(() => {
    const map = new Map<
      string,
      { sends: number; products: Record<string, number> }
    >();

    activeBroadcasts.forEach((b) => {
      b.result.forEach((day) => {
        if (day.date !== selectedDate) return;
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
    });

    return Array.from(map.entries()).map(([name, stat]) => ({ name, ...stat }));
  }, [activeBroadcasts, selectedDate]);

  const partnerColors = useMemo(() => {
    const partners = new Set(chartData.map((e) => e.partner));
    const palette = ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56", "#2ecc71"];
    const map: Record<string, string> = {};
    Array.from(partners).forEach((p, i) => {
      map[p] = palette[i % palette.length];
    });
    return map;
  }, [chartData]);

  useEffect(() => {
    if (broadcasts.length && !selectedBroadcast) {
      setSelectedBroadcast("All");
    }
  }, [broadcasts]);

  useEffect(() => {
    if (availableDates.length && !selectedDate) {
      setSelectedDate(availableDates[availableDates.length - 1]);
    }
  }, [availableDates]);

  const series = Array.from(new Set(chartData.map((e) => e.partner))).map(
    (partner) => ({
      dataKey: partner,
      label: partner,
      color: partnerColors[partner],
    })
  );

  const grouped = chartData.reduce((acc, curr) => {
    if (!acc[curr.copy]) acc[curr.copy] = { copy: curr.copy };
    acc[curr.copy][curr.partner] = (acc[curr.copy][curr.partner] || 0) + curr.sends;
    return acc;
  }, {} as Record<string, any>);  

  const dataset = Object.values(grouped);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ p: 0 }}>
        <Grid container spacing={3}>
          <Grid component={Card}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Broadcast Chart
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  <Autocomplete
                    options={["All", ...broadcasts.map((b) => b.name)]}
                    value={selectedBroadcast}
                    onChange={(_, v) => v && setSelectedBroadcast(v)}
                    renderInput={(params) => (
                      <TextField {...params} label="Broadcast" />
                    )}
                    fullWidth
                  />
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
                    minWidth: "1000px",
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
                    width={Math.max(
                      dataset.length * 50,
                      document.body.clientWidth
                    )}
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
  );
};

export default BroadcastSendsAnalytics;
