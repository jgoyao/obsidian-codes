# Advanced Table

Table generation and formulas

# Formulas Reference
    https://github.com/tgrosinger/md-advanced-tables/blob/main/docs/formulas.md

# Examples 

# Real

| Months\Proj | CoE1 | CT-Set-up | CT-Validation | FA2-FRMCS | CT-ITxPT | FA2-RD | TFM  | Est    | Total |
| ----------- | ---- | --------- | ------------- | --------- | -------- | ------ | ---- | ------ | ----- |
| Jan         | 117  |           |               | 6         |          | 24.25  | 0.75 | 148    | 148   |
| Feb         |      |           |               |           |          |        |      | 153,25 | 0     |
| Mar         |      |           |               |           |          |        |      |        | 0     |
| Abr         |      |           |               |           |          |        |      |        | 0     |
| May         |      |           |               |           |          |        |      |        | 0     |
| Jun         |      |           |               |           |          |        |      |        | 0     |
| Jul         |      |           |               |           |          |        |      |        | 0     |
| Ago         |      |           |               |           |          |        |      |        | 0     |
| Sep         |      |           |               |           |          |        |      |        | 0     |
| Oct         |      |           |               |           |          |        |      |        | 0     |
| Nov         |      |           |               |           |          |        |      |        | 0     |
| Dec         |      |           |               |           |          |        |      |        | 0     |
| Total       | 117  | 0         | 0             | 6         | 0        | 24.25  | 0.75 | 148    | 148   |
<!-- TBLFM: @I$>..@13$>=sum($2..$-2) -->
<!-- TBLFM: @>$2..@>$>=sum(@I..@-1) -->

# Imputado

| Months\Proj  | CoE1 | CT-Set-up | CT-Validation | FA2-FRMCS | CT-ITxPT | FA2-RD | TFM | Total |
| ------------ | ---- | --------- | ------------- | --------- | -------- | ------ | --- | ----- |
| Plannificado | 400  | 200       | 200           | 110       | 200      | 500    | 0   | 1610  |
| Jan          |      | 69        |               | 5         |          | 74     |     | 148   |
| Feb          |      |           |               |           |          |        |     | 0     |
| Mar          |      |           |               |           |          |        |     | 0     |
| Abr          |      |           |               |           |          |        |     | 0     |
| May          |      |           |               |           |          |        |     | 0     |
| Jun          |      |           |               |           |          |        |     | 0     |
| Jul          |      |           |               |           |          |        |     | 0     |
| Ago          |      |           |               |           |          |        |     | 0     |
| Sep          |      |           |               |           |          |        |     | 0     |
| Oct          |      |           |               |           |          |        |     | 0     |
| Nov          |      |           |               |           |          |        |     | 0     |
| Dec          |      |           |               |           |          |        |     | 0     |
| Total        | 0    | 69        | 0             | 5         | 0        | 74     | 0   | 148   |
| Diff         | 400  | 131       | 200           | 105       | 200      | 426    | 0   | 1462  |
<!-- TBLFM: @I$>..@14$>=sum($2..$-1) -->
<!-- TBLFM: @15$2..@15$>=sum(@3..@-1) -->
<!-- TBLFM: @16$2..@16$>=(@I-@-1) -->
