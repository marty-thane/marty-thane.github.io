# naimportuj knihovny
library(dplyr)
library(tidyr)
library(igraph)

# seznam .csv souboru, ze kterych bereme data (ziskanych ze STAG)
files <- data.frame(filename = list.files("data", full.names = TRUE))

# spojeni .csv souboru do dataframu, ziskani celeho nazvu predmetu a
# odfiltrovani nepotrebnych informaci
df <- files %>%
	rowwise() %>%
	do(., read.csv(file=.$filename, sep = ";") %>%
	  select(katedra, zkratka, podminujePredmety)) %>%
	mutate(predmet = paste(katedra, zkratka, sep = "/")) %>%
	select(predmet, podminujePredmety)

# seznam predmetu (vrcholu grafu)
vertices <- df$predmet

# seznam zavislosti (hran grafu), pricemz se zbavujeme navaznosti mimo obor
# (napr. predmety katedry fyziky). tento zpusob take implicitne filtruje
# predmety bez navaznosti (v dataframu nenajdeme NAN hodnoty)
edges <- df %>%
	mutate(podminujePredmety = strsplit(podminujePredmety, ", ")) %>%
	unnest(podminujePredmety) %>%
	filter(podminujePredmety %in% vertices)

# vytvoreni grafu, nastaveni rozlozeni
graph <- graph_from_data_frame(edges, directed = TRUE, vertices = vertices)
layout <- layout_with_kk(graph)

# obarveni vrcholu na zaklade out-degree, tj. kolik predmetu dany predmet
# dohromady podminuje.
out_degrees <- degree(graph, mode = "out")
colors <- colorRampPalette(c("yellow", "red"))(max(out_degrees) + 1)
V(graph)$color <- colors[out_degrees + 1]

# vystup a export do png
png("courses.png", width = 2400, height = 2400, units = "px", res = 200)
plot(graph, layout = layout, vertex.label.cex = 0.7, vertex.size = 10,
	edge.arrow.size = 0.5, main = "Course Dependency Graph (KI/API)")
dev.off()
