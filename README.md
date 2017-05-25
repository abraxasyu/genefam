# genefam
gene (pseudo) family search/visualization tool for Y.Zhang and T.Johnson @ OSUMC


Uses node.js/express.js/socket.io/ssh2

User submits genesequence from website

submitscript.js handles messaging genesequence from client to server (index.js)

server runs 'getjson' function, logs into osc via ssh, runs a batch job to generate json (see: https://www.osc.edu/supercomputing/batch-processing-at-osc/job-submission)

function then checks (every 5 secs) if output json exists

if it exists, it outputs content via cat, reads it, then sends it to client

submitscript receives the json, and runs genefdgraph which generates an updated d3 force-directed graph.


example sequence: 

GCCAGGTGAGGTGGTGTGCCTGTAGTCCCAGCTACTCAGGAGGCTGAGGTGAGAGGATCACTTGAGCCTAGGCGTTCTGGGCTGTAGTGCACTGTGCTGATGAGATGTCCACATTAAGTTCAGCATCGATAATGGTGACCTCCTTGGAACAGGGGACCAACAGCTTGCCTAACGAGGGGTGAACCAGCCCAGGTTGGAAACAAAGCAGCTCAAAACTCCCATGGTGATCAGTAGTGGGATTGTGCCTATGAATAGCCACTGCACTCCAGCCAAGGCAACACAGTGAGACTCCATCTCT

Takes about 4 min to run
