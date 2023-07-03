import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import jwt_decode from "jwt-decode";
import axios from "axios";
import useStyles from "./styles";
import { CssBaseline } from "@material-ui/core";
import Cookies from "universal-cookie";
import { formatter } from "../../../lib/formatM";
export default function ListOrder() {
  const classes = useStyles();
  const cookies = new Cookies();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [token, setToken] = useState(
    cookies.get("access_token") ? cookies.get("access_token") : "NoneLogin"
  );
  const [id_u, setId_u] = useState(
    cookies.get("access_token")
      ? jwt_decode(cookies.get("access_token")).id
      : "NoneLogin"
  );

  const [listBook, setListBook] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = [
    { id: "id_order", label: "Order", minWidth: 170 },
    { id: "status", label: "Status", minWidth: 170 },
    { id: "total", label: "Total", minWidth: 170 },
  ];

  const getListBook = (id_user, token) => {
    axios
      .get(
        process.env.REACT_APP_API +
          `/Order/ListOrder?id_user=${id_user}&token=${token}`
      )
      .then((res) => {
        // console.log(res.data);
        if (res.data.message === "success") {
          setListBook(res.data.data);
        }
      });
  };

  useEffect(() => {
    getListBook(id_u, token);
  }, []);

  return (
    <>
      {listBook ? (
        <>
          <CssBaseline />
          <div className={classes.toolbar} />
          <main className={classes.layout}>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  {listBook.length === 0 ? (
                    <TableBody>
                      <TableRow hover role="checkbox" key="nodata">
                        <TableCell></TableCell>
                        <TableCell align="center">No Order</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  ) : (
                    <TableBody>
                      {listBook
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id_order}
                            >
                              {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    key={column.id_order}
                                    align={column.align}
                                  >
                                    {column.id === "id_order" ? (
                                      <a
                                        href={`/order/${value}`}
                                        // style={{
                                        //   marginTop: 0,
                                        //   marginBottom: "1rem",
                                        // }}
                                      >
                                        <p>{`Order#${
                                          index + page * rowsPerPage + 1
                                        }`}</p>
                                      </a>
                                    ) : column.id === "total" ? (
                                      <p>{formatter.format(value)}</p>
                                    ) : (
                                      <p>{value}</p>
                                    )}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={listBook.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </main>
        </>
      ) : (
        <div>
          <p>Loading</p>
        </div>
      )}
    </>
  );
}
