<?php
session_start();
include('../dbclas/pdocls.php');
// use Dompdf\Dompdf;

// $dompdf=new Dompdf();
// $dompdf->loadHtml("<table border='1'><tr><td>School 1</td><td>Percent1</td></tr><tr><td> School 2</td><td> Percent2</td></tr><tr><td> School 3</td><td> Percent3</td></tr></table>");
// ob_start();
// include "test.php";
// $html = ob_get_clean();
// $dompdf->loadHtml($html,'UTF-8');
// $dompdf->setPaper('A4','landscape');
// $dompdf->render();
//  $dompdf->stream("aaa",array('Attachment'=>0));
// $db = new database("root", "", "localhost", "symposiumapp");
echo base64_decode("/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUTExMWFRUXFxoYGBgYGBUVGRYYFxcWFhcXGBgYHiggGBsmHRcXITEhJSkrLi4uGB8zODMsNyguLisBCgoKDg0OGxAQGy8lICUtLi0vLy0tLS0tLS0tLS4vNS8tLS0tLS0tLS0tLS0tLTUtLS0tLS0tLS0tLS0tLS0tLf/AABEIALEBHAMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAEAAIDBQYBBwj/xABDEAABAwIEBAMGAwQJAgcAAAABAAIRAyEEEjFBBSJRYRNxgQYykaGxwUJS8GJy0fEHFCMzgpKys+FDcxUkNFN0k6L/xAAaAQADAQEBAQAAAAAAAAAAAAAAAgMBBAUG/8QALBEAAgICAgEDBAEDBQAAAAAAAAECEQMhEjEEE0FRIjJx8GFSscEzQoGRof/aAAwDAQACEQMRAD8A8OSSSQAkkkkAJJJJACSSSQAkkkkAJJJJACSCS6g1CXVxOWDo6Anhqa1SBKx0PYFOwqIBSNKkykQmm1FUmp3A+G1cVVbRotLnu0A2AuSegHVeqcN/owFLDh2LrMp3LqpbzECwp0mnTXmJuScoGkmTi2PyUezzSmiqQlaDivs+ajw3DUiA0XFmhrQXiaj3XL3FpFyLggAXa1lH2UqtANRzWzPKBUe8xYnKxpIA3LoGlyoyxssporqTO/3UzWoh+BDIMyD7v7Q/MNsveb7SLpgaZMaLklXI6Y9aCKGndWFAxqJHQ/PRA0aRGqNntCyTRSITIJJiAToNB2Ep4ahs6mpvUlFMpYXSRVMoFj+iIY5bxo1MsGOlOLwEO2pATC+SscUbYVmXJUOdMLz2WNmnzwkkkvpT5cSSSSAEkkkgBJJJIASSSSAEkkkgBJzmkEgiCLEG0Jq6EAdC6mpwWFEOangpgT2lKx0SNKteF4Wk6m99Y1AA+nTBZlOU1G1XZi1w5wPD90Oab6qrYrzg1HxMPimTGQU64G5yONJ5noG1iSO3ZTbopFWevew5ocPpsZAdUrXztAmo3MW0wwgSWGMwm5z7aDZ491CtlzvdDZhrSQZIgmW3ENJEi4zGDK8q9mOJVDhqTqgb/YsNOmSAPDYBGbqXEwLnRhhabAYhzAwjmJEy6STHZoud4/goqUuRSUFR6JwsNygtaGMEZWxEQNYIBB8+iB49g6L2lrnuBfezwTafcDw4D/CNkDwXiROrj1uHNPwcr3GYajWpxWax7JzcwBAI0d2I6qt2qRzyjxlZ45xnD0GOl4xj805XurUagdB/PlM221CraPhnUPHS7Xx52bK0Ptd7K06FQ+GHwRns6mRExoSHRJF4MTHRZWkQT2XkZ+Sl0ephpq0yyo3Ur0NRqQpsylHZ0se1OD0zMkE9C2FUnokOhB07JzqqzsYN8WU4PhAsqQk6snoyywbUXS8KvZWKjdikKKYcqPEEkkl7584JJJJACSSSQAkkkkAJJJJACSSSQAl1cXQgBJwXElhRDwnBMBOm36/iU5qxjompla/2XcKNCpVMZ6x8BoI0pDK6s4HuTTb5B6yFNaTg2KDqWR7ySwnwmZRDWul1Ql+vvZYHmoZOmWh2j0H2Xog0XEiwqNHoyX/V8+iJwONMHMZpkyQRzUybkZXWc3y9IIlAeyuOnD1Ke4AcPUlp/wBKVGg9tZ5mWE6ayDeD01UovSKSW2azBVssFjszfp6i49Z81rOH4lwAnQ+Tm/EaLz7CuDdAY7RPqAtdwHHaCQQqdE2k0He0vCBiqRaLGLaW8iQYadwLx5Lx/G8ONEkZg6DsHDyMOA+Uwvb8RXaMrS4szkBrtg/UCTYE9N9l5x/SFgXEDEGmKbw806rWnM0yXGnUDp3Au2JBcOyh5ONNchvGyOL4mQFRE4epfRVzTKMw74Xmx0ekFuA0mE4OGyHzd1zxFWKBsnfUXBVQr6qY2qtUDOQcaq4KiEL1x9ZNxMsNNTZRkoQVU04hbxCzypJJJe0eAJJJJACSSXSUAcSSSQAkkkkAJJJJACXVxdQaJdC4pKOoWMZHfCIExZS0aDnaBENcdBon1XFsRZRc30XUUgQCDCO4ZVy1G2mbQNboJxkyrP2cZNdlgSJLQ7QuAJYD1vFt0S2tmx70aXB4x1BzTMBzHA9iKj4JG8EfAq6PEWuAc066i0i3wNvos6JqU6ROpa8n/wCypMoGmCHTJC4/Y6z0bhlaYh0+dj8FqeHNvZeSYTFva7M0/G62XCvahtg6m9p6tgj5rYZf6jJY/wCk9VwTmvblcARax0kEEH4gH0WX9quCFtKowZ3sfTDGfiNM03Z6QeTJIkubnOgIkiJU/BfaOm7XMY3iI6k9B3TuL+2OFgtAc8jRwgBp6g/wV21x7ObjLlaR5GWkGCCD0IIPwKlounS5Wiq4jCueXGmXOJnmILQTqQ1rWgyZPNIklOfxOo0clYtaPwthg+DYC4PRV2d6myiY8gyR6LlRm9x2Wio8ee7lfNRv5Xw8fB0oXiHC6VYZsM7w370nnlJ/YefdPZ1u4Rwd6ZrlS2jN1Ki4KihxLXMc5jwWuaYc0iCD0IKjzKlC8g5tVRvqIYVUwvRRvIJNRR+IhvFXDUW0FmESSSXqniCSSSQAkkkkAJJKF2EG0cST8tt538v1KQprLDixiSmFJcbSRaG4MiXUQ2h1XDTWckbwZCAutClFNSspLHJDqJ1jstzqnsfJv6LopTdOFIqTaKpM6QAbgJ1GoWODmG407JxpGylbh1PkhqZrsE/xWNfqTTcTp72eNibnMO8m95VTWpZXAep9bqz9nGFtB5Ohfl9MrHOA6RDfVwQ+GpeK8uO5UWlZ0LofhWyr7BUmtEmOqqyQzTQfNMq4o5fNI4jxkWGK4mSIBhv5dvM9SgHVyUCa8lS01oBTayMwta4BEoFoRFFxaQRsZW0FmuwuEptEGzu4keSlZw5lX3DkeDBGrSft5yVXUcXmDe4+o0+SKo4jI4O669/+VfjH4IOUvkh4jw/+tNNJw/8ANUx/ZuETVaP+i47mPdJ3tobYkNAXp3GaEsbXZ7zYmOmx+KxvtLgprCqxtqzc8DQVJLag/wAwLo6PClONDQlf77lIWSoyxT1MM4HumupO+CmirB20r30TK2Hg26d0ZhaRdykXOnmpKtMtJaTBFjoklkUWaoto82hKFIGGJi2k9zMfQ/BJrSvXs8ngRwuhqKfh7mDI66W8kwMMwl5DemQ5CuAGYhFuw5H67SfqEOBzLVKzHGjgaei7kPREtlTCibQNUjnQ6gBtDvyqamCMpLeUn1gESf10RVKlcAnVRuaQL/q0pedj8AdzjJhtpt5bLoLvyIpgsD1MfCL/ADT8a3K7lOZhu0mAcsmMwGjo2Wcvag4gznu/ImPcRctRdem5oHcA+hUWJMt13WRZrQxgJE5U9knRqOwWFc6nIEhpAPUFwe4W8mOPoo6Aie5SOfYyj0Mph35VKc2paiGImjhnFhfHKDBPmovIVUQSmXfkUoquH4FPQaToPM3gDqegRb8AQ7mI5agaQLzqDBFospuavaHUWFYiqWBlHTLTl0f+5Uh7h5gZG/4E/DPyUiRqVWYuqfEc79o/VGVao8MEflVEYDOrypqx5Qqym+6sXCWeiGjUDs1R1MoGjdE54WJGhYepsw8lXCopRVW2BecOqWj0/XxRxqyPP6rLjGlrXGdBPwVzQxOZua0ETb42VIvRNrZrfZ/ig/u3+66wm4ndpRnH/Zt4ZTfQAe1rnmCXAtztbBlrTmALRcxAJusdhsRDp2O31C3nsvxkx4TyS3Zw1CZpSjTE3GXKJ5tjhXBINGSN2kwb63HZDMZWeYGGcTGgPRey8R4MXmQGPm85Gh+lriJ/VlV0cG2ibtgxHSSTpfc2C8+XqQlTWjshKE13s8vwVSsXRTw+ZzT1Oogwf4KxpYeuQM+ALyJ5vGyTJJ0B7q7x3HfAw9V7qN/EblZlLIzkeHLgOkHebxMGMweGYvFTVr4nw3EkBmmVo0AAcI369zKGr26Q/wDCPNq+FfTAJBAc0O9HZgD8j802jScXBoFyPtmt6L0HiXB3O8SqYcXZWBgZamMzTyCbNa1tQeTzKtcd7MipiG1WlrQW5RlbYCH5trWcNrW9ep+fjSONeHNsxXBeAVKuYFpbyOc1xBykAOFiBBhwAPqtDi/Z9jGPo0iXhjhiA5wGZ00GkssLjlJnQAnWL6fg2GeGNYW/3dgdA8PY0vzN3GciRpImBorLC8DbVc5z7NJOnLYSyLG7YH2vF+KXmylOonVHxVGNyPMeMcDAotcAGVS4EyTIBBzS3aAGH/EeipuI4ek2o1tNhIytBcZu/wANxeYmzcxEfuL1fjvslDC1hJec7gdRNRwcTMWaI6BUR9kC2q2p1e1jmNJuLse+590ghxGtiN1bH5kY2pv5EyeNypxXwYHC8OLy1rbHT/Gc2UesBXTsO4VHOptAOWpAOwe1zZA6hriR5LWv9lC+g4QGvBlus5tOsRBdB+V5R2H9ln+E5puQ45CNQCA0gzpYTvqfMrPzYvaNj4rWjEP4SX4dmQtbL2gzbLH9kCT+UWdP7R6Iup7Pjw8wIIcwQScvM1wpkebmAHT8XZa2n7LPaGNAY5gg3973mO5rbxFtiUY/hsU8jmzlzb3GYXHLqCNhpEX1UJ+ZJbXyVj48WeZjhjSWtc0imZLTc8pAEg2mHfVGv4Mcpa4Q4NEOcSYaCSIAMCwj17rejgTXvY9sNaBDxAcCyBGp1kC489QisVwtppuBdpvrpsAPpfRZLzZOuPQLxoq7PN3+z1Rzw0NBkTYiMoi4J7EWPW8Lp9miaj6BBBJDRA3z02l1+zifVeiUeHlhy5gSGgAujV0gtAGrbGJ69pU1fBscA8XILmg2DgS/myk92D5oj5k1s1+PBnnuF4VVpsc+m1uU0xdxbIY2nd17S4E97n1ExnC7yGhocxrmAElps0PIm4GabG4mF6YcCx7B/ZsdJALQJaXBwBEf4BroiWcApB2ZzWXGU2BgDMYHQT8wE0fKk+xZYInnuC4G456eZsU4cTcznANo1jLt0KnHAyIpzDS8Z4nchum4bf5yt8/g9MSQNR3AMX08tE1nCmg+ISQWuLhFrOtt5qTzZGyixwSMfw7hrfCe5rZDxroWxLTH5tRby2UjuEzlZkIgiS0EyQSNPKCR+yTutdW4LTcwQ0BpcJadDIDZjrMfBGs4cxgiQbW69x5JbyN2jfoqmeI8TaaVRzHi7XEHzBIny39VA/ETTA6Ej7/f5LXf0p8ENLw8Q0WeSx/ZwE0/i0Ef4FgW2F16+P6opnnz1JpBbHIvC4qLHRVQrKY1ZCZoVSLCY0UmdAUqmiLa4DVLQ6ZOwqTZQUnTdNrVCJcdENGnazuR/wC6UvZ7HENLDotT7HezBqu8XFMijFmOsauYQJGoYAZm0kDZZbjPA6mCqXBNJx/s3ncXIa/8r41HYwiLVV7g0y9oVYMTb6K94RjyxwvvY/ZZTAVs7Z6a+XVWWHqG3bdPFiSR7fwzFipSDmwbaTF/PZVXEahqHLmkAzlPLUaQRBaR63BkKh9k+MZXBpMbH9brTcYwsjxBcHXQx3/kVmW3HQuNKM9nmvHcA55bUY1knK4mOYlk8sxYAAbDXeYUmIfSabvqUpE5KeaBciSWxmJiZNzPktLVw7WuJOoM+pmZ+qCx1Njnkg/ruuD667PQ4xJauBcwkNbDT8dNZ1GuuqkdTyszGG8uthB6nqIVviHtiD5fOP4IKuAWxt37FefPEoN09fBaORyStFdgcLyncZpaTu1wibRtGvZdbUe6oQ0y0TA8nSe2+vRG14AEXNrfBco4ZucT+Hz1P/Cn3Koj3q2S08XOt7EaTG947KKW9pnrqiG0WgnLub6+f0EfBC+FnZmboRmjSBAj5KmSM3H5EjKN/A6ri2ZRcEibboY8YAYBBgggHqRG/kR8UqPCQA9zpDg231BPe2qm/wDD2ua5rouZy6hroJsPKPgiMZ9/wDcOiMcTANz7uadrDt02/mqx+OfXGZrSIkg6SwS1r4OWznAgEdCp+J8LaBJaSMpBDRctg5m2uSSQIn7gi8MoZCSSZLA05zzEMHJMEgW77rdKL5G9vRYYVzhIiDDj5CeX4rjWZvFg2EOkWvlaCIG3KD673UtMsmwhxBHUw05QbeSByw17hMF5hwgkPHJJv132ntKSKroxu+yetVIJJIOVtjckGDtqdI68x6qH+t5qYdBBy5pEkCTaQNdh6lV+KwxzOeXOkTa2sxOUa3J6aAhdr1gwNdDjYC94zHM6QSNYmL+kwqRxtrsxyS9i0wGPBJk2DjYag54AP+b+SJxfFWNOcySASZ0tcA/FYzG+0TWUyxw/tMpL4BsCQAQd75d941hBYLiplrqhzS5wzA2s46GwZMNvAME6BVj4+TjfsK8kLo3B4+SOkmRbRsQ1wB1tm0H3V7hKrXNDRcxF+389PNYfhmMph1nE2Dcp2IGWZH7Ri1uayvuFVRc5rkWvM6SfPS5SxlJPaNlFNaZYV39LXy7fnDTqev6unUMSHODm3DZbqLcwBn4SOyrKuMc7m0mHAjyDQ3vJk+qCr4lwmLZiPhFx8BE9p8xSSnS9zOL42wr2io+Pg8RTDg45KhgD8YLare8giAe5XiFWplEFeztxES3qWnrPNp5ct15T7RcM8Cs9kcsyw9WHT4aHuF6njZOWmcefHx2ikpEucA0FxJAAAJJJsAANT2RVSm9jstRrmOH4XgtPwN1a+xVGMWx35WvO+9NzRp0LgfRbHjVRuSKjWPkQxrmh/Uvfv7smI3tsVbJlSko0Shjcot2edNrQjadTMJCdR4c3EVQ2i3K20uuQ0dT3tp/Na5nCcOKYY2kG294R4hgxOaCTvY27LJzjEaEJMoMHSDbm6nOLyOa4AEtIcJEiQZuNwpMfwavTksLajRsSGOg30cYPoZ7Ksqh4/vGOZ+8CBfS+iE01oKa7N5hvbei9sPJpE65pLZtMEeusKbjVEYrDObLTnEtcHBwkXbBFtRr5heWVauvyWo9m+KvGHId7pectjNgzNtpopvGltFFkb0wf2YxDGVRns18scNAM1gb6QYPotRj+EuouLTsY+4+SxOPZDndDcHrOvzlelcDxhxuHYXXqNb4VTuWtJpuvvaD+8metiL4K/h1UtII/mvSeB40VqRbJFvKPIrzOnymf2rrVezdfJUaJs52X0IkfGT8FqlTMlG0R8boVW1S1wcQTyuANwYEGBa+/dUDsfkJDmk7i+W3wVzx/jLsM51CoS4TyPGUuAuWk6ugEi4g2JHRYpuMDZk1AXHNYMfrvNtYnQa+pRxVjxnKtm6xWOcWPLILodsTcToBc3n4bqoqcadmFMNJGUlr/AMxzWt5D5o3hzI95o5nFwktBEknSNidNbhQ1+ECoS6ctyRlAs2fdmOlzO68X6Ptmd++4kT/aBjC3NIJAgGwjck/HzXKPtE15EEgkgwSPdIcM0g6TI8wq7F8CFUkmXNIs4mCYMtFoFszrkSNtShK/BH1ctIODQ1jSCObRpGS9onKSRpPU3pjweP7Sr/AssmTujS1PaGnOQPBeJcW7iLwPS/pCLw/GA4QNiGyNJvYHQrGcK4TWc5/jRJdkcYmQX5muBJgt1taJjeATi+HsAhwECTzOaGl7C5oB0JJy7HfzgnhgpcVJ/wBwU21bRsafEg8ZtI2IgyJkHqIITv67fQg6mJNrCfn8is4KREtpmSS0FukTnzEjYGQbbwpcFxF2cAw33RAJ0zO/MBI93pedlOpStro3S0XddpqUxlcWuudjfmkHr6R1lBYl4DyCT0JIN5IBgnXLmF/VDcJxWekwzo1pB1sW6HuOYfAqHEPEDKCZdDhrGsZmk9QT3yxKR7lxaHWldk1HFtZZzwYJMaRAgi2ouPgPQHEcRa1rrEtzkkRIMuzWj9oqSlRBkT7zsrYFyOaR5i50vltoEM9rGtMOBGWXRocriXETrMtHflVlG3b29CXrRG7GVXVOZsskEEXaSLgOty3AMaC3RdrvFSCGEwwMgnNmytMRoMxPppJ6QDiLX2FwQBsNXtiCDzEwBHlrMIzhuNpuLRJyluaewLfWxy31ValGNqIum+zLnC1HOz5CaVQPIa4mpGallD3Dp4ha4TrBOyJwHAawpvzNEOkgA6eJlaQ3LJy62t6wQdRiCC4AAl2UkwALGQJvrcRfbsiMI4y4h28bC9tDuNb9U+bzppUkJj8aPbZmMPwqo2rVax7TzZgXNMhoJyNFo0jfUCy1FRhyADUOme0ZT5aTPVKtXFjI3/XyQJ4kG/D+BC5vVnldllCMFRYCrJncD4EOjT0Mf8oLFvl40kNEjznNHX8Pw81V0seAZLjGvzIda3RBDjMOdJBMHXoTJ+isscvYRzRa18bBbqbC1p94/wAQPQKv4+0Yig4QPEZzMJIB7tHZwB9WtOyqa3GCYMzaPIfz69kIMfIMagE/QLrxY5RdnPkyJ6APZ3F5K7D1OU+TgWn5FaLjFf8AtW8xOankGwkOcTHcgg+qyVd0VA8WmHQNjvp3BWjrPc0nK4Pa4B4Np0zEEfmBMek6FdeSO1I54S1xLfhPDGMwtR4gnxRn/Nlywwztcv8An2TaOLjl17GLy6QT8Z9FJw/EeEScrXg8pY8SHgEOI+TSDYiyg4nxus0uyUcMKZDgAKLCBmIFnXMjKIdM6ztCOKk+x4tx1Q6pjJDvK3201Vdica4SQTDpBvMZrOB8+ihwVR7g7M0sg6HfexN0RSYObMJdsJsD179pslqnQzdozWPpxzDQ7dND9wrOhVy4eh3dWt1ALOaNdSRP7B6IctJDmkXzG3SAJ+iHxbnDwmSYawFomw8QCo6BtMj4Lpq1RzN0yzrva8yBFvJav+jHEPFWrIJaGt//ACDb/K0D/COixOHAa6M05gDuI1EXXovs7hqjKJY3lLgTpApsNi8ndzhYDYO2UZviqLQ+ohr1o8TTLmPeb9fKEdhq5DqLbhzSAestIBHoHH4FU3GKnhBjW3I5iAC4k/czPndWnDMKaNI4moC54bLGN5jlnMSGg81zmJF7xZT7SKLTZYf0hVcPVYXF7RUYCIDm5swA5Mp1BmZ2y97eYsql/NE+qIx7HVapeHF5BmSACXRL5MA++SdIvsmOpCAMosLXHU9f1dV0TVnpFJstII5hyHbKYa4CTrbKZH5lPg6hnLOzjB1IBF5noY2Uz2hoIaMtxNriQNT67/zWJrc3l02FyesiNl8/OMWz1FdDKTwGSTaSOkduw2v0Vfh+KsNR7JEg2BLTbKCd9NRNtfUyVsYwHLYNePeJAbBv1sNPkgcRQpkECGyJBtJa4NkAT2HTToE2LBCVuSdMWU2tItTVEaCdT5jU9xoq6tispDgJbmkiW6EB1p13ugfA5n1GycsB5zEzlB0E82ukbRuhn0sUagDIGcvDzdwYGmnleC4c3vOb3idVSHixT+7/ALFllddF6cSC7NpIbBi5hxk9SCSD0Ntbqtq1n5qhn3Q12QN5gS1uaYkiOcd9dkJRqmmHFxsJgl1xD/ceY2ERf8Q6hcqMMvdmglrTpnDgIAmebLAmO09j0wxRj+CUpNhOG4nFTwqYa2HAEbZctsvLc8wF+k9QmYjixBDDLXZwSJDg8Wz3iPxDTveyAxLm0A0C2awcXD3pc7QmALxOsfN1elTqNzGoQxuV5dAzFpEvmReRF/h0Lelju6M5T2rJuK+O6fBGRrWxzZmC3MG0xEOIGW0HzEoHg9GKNV7zBBDXNqQ0XgvMkiG8wMAAggaxfRMrywsguIY2S4NJc8G066G5779KPH4d1Wk4ls5mx+InqHD9ogAR1HYhVg4pcapfP7/yTad3ZSji4dWLM5LHFpGaXEOymnBgab+oKsjiXM5tS5gyEDUVJcdLHKG0gTsQeqquDcBqNqg9Q8GM0NtFnWy3MTfdWXDqJimBM0nuDdBAGZ7hAAMHNB/cBiTC6Mnp+xGHP3LPC4hwGZgyudYWJyZQGgOJsZgHuW9oXW8Wq0yGmmXcxki4OhBYCNribiQekEDHYh7GiHEF5EG5kw4ZRa4Ji95nqEX/AFerU8NjpIEtcWghodYOkRYc3QjTULleOPbXZ0KT6QDiuK85a2SHRAkGcwMOBAG820sVVVOJRYuIJANyYGo200+Q9LfF8Na2rmiwB6m+aczbjm1IF/ULMV8PUqVWZiRJ9QCZbp3cB6row4sbWiGWc12E1cdIPX+H01TKtCpka86EXmZHYo+n7P1K4qClDhTZLpOgDoMbxLhp1J0lTVqbm0vCeMr2mCLAEiGyBoelp20VKjFWhNt7BeFYcOYWmAXctyO+nS4B32TOMWc42DnEuMdTrbzv8kPRq5c0zI09NfnChxlYudM/dCuzG1RBiiCRuMo/zESdNTJVxQp5aVzBLdxBvlEROm4duh8Pw/OA50RmAE3HmdwPRGVBlbE3AIja2h6zB+MLZSTVBGL7AH411oJgT8Tr5aD4K2oYjkAmRlBBiOkyDqRmP/Kr6OEkO0kCTbUGNx3IT8PhCxuaJkAXGkkwbehnuVklEaNofVx+WImdTM691PgeI5SZ3PzG5H/CjxGAa0c0ZoJsTrfrfcCP2VWudvMTprdYoprRrk0GYuiLuAgFsN7u3+X1U/EMOG1ByzFKgI0IDaFKCD3EG3XzUVPE+6HAAAAEmzR3J21n1U/GuIUKgY7xSKwphj2lvK8sMNIeDqKeQQQPcmZsbU60Rv6rZzCMkNAIzWhxiGxee0fwXo/DMS2nQa01CHEauN3ugmw8pP6v4+a19SLo/h2MqkOHiuN2uALiQLPFp/e+XZRnjtbLQyU9HoFbFUKNTnB8SMxJiROwv7x6DQR2CrON+0PiUwGtyOYXOa4EEZXEktbEEgjL+KbHW0ZgxmkkSfW9omdvun1amgLJEQSJ0EDTaBCSMVHoaUr7J24kZbAtkkkXnYm5knTXso31naiwPZvlvfZDf1e1iJ7gE2Py2Q/ineyerF5M9bGMYWzeTAvtIBi3YD5qeiRAttqPpf1/QWWFA0mAhxJgPIdDTcOc0Ho4BsR39VFT4441HUoIfLhaTGn69fReQ8E7tHoerFLZpcThmSdJgzfY636wqvHYsNyvyZSGlpIEhumwIm8fAruGLnMJe4gkk819YAggaDT1m6irOBZBadLgAyAdYvOm14ifJYY+Mt9fujZS5LRHV4iBmMbCC4OEzZtxeIGp6JUcT/ayQQDyiSBob2OmonT3RqhqjqdRk+6W2sQ2eUEEGd5t9FEKsFxJJDM0k9ILpGm4Gv5mwnWJNPX8CubLjiFNwaXtMvBsZGrmgO1Gl5+KDr1YNPu0Ew2NWuyyDpBIt+0U6hxIYmnDTAmGEWi9vO21/mqZ2LhxqhwAaCzluI5nAx05Dpa4EaJ4YpVT9rFlNWWuPAeWtqNLgHZrmBYnKJ1mSTH3TcO8c5LRMQ7cuZmg33vqO6biOI03EOBAabTYtadLkCbTf5IKhjQ14Z77HGWwbAGXkgn3d9e/qscc2vwa5RTLfCUZqPc3kaAAMoaQ43zWmxib977rjcxbEbgC4iABAJmwva8qrwmPfTzD3YgN/EWmZzdCDIPl6o3B4yGyZmYvN7kE20GaSqZISoyMlZLiXkEgANc4HLIAzW5gO5ufXWTespYcZnAw2dCLbaHSeX9aKXF4iSHh2YjMSCZs6XXFraCRfopOJvBl08pEAAtb75DSBlkQekG57rMcZV+TJNAtbCtgZYGWDEnbUgjT7K1wjwAHANzZWm0GCR6RfMfUrKYjEPbYa6XidR9QR8VPhuIAtAdOgmCZEAxHxB31nsrvFKiayKyzqUpe4u5mwCBf8R2t99lSY5gEvIbZ5c3Y3B1ntHXr3UtDiBte/MO8Zba6j9eVZicWS4A6RYHz0M+QVcUZJk8kotBtHiTrZTlu6CLRIg3HayhqYoZrmREa62/5VdUxgkNiCAR8bfryQRr7a3VliIvIEYrEy6e5+qbQuRKBpmUVRqATJj7yrONIkpW7NA3EEAAfCLRv/NJ2NFhvM27dDKoKmIMmD/JRGobSdpG9lNYh/VNG2o3fp5eeie7EtAkTp85mf11VFTxUNN7yIP1UT8bIR6TN9VItMVi5En9X7KsNUk6WH3/XyQ9WrZconc3CrGFIlKdsvcDxo4chwY17gQ4B4loLQQJG4vGVZ/FtGoM/K/kpcRubn6eSDdUsngvgWcgvDVJiUXh3xJBi4+8KsZVgGN/suitZEoWClRcOxBtItt/NPZji3lPmPKI+Cpm4s2Gy7iqxmZ1KX0vkb1C1OMPdRVcTpfZVT65TRJ2lasSFeQ9Qqf8Aomf9p3+kKDhP99jP3KX+7QXUlzZf3/w6Ido0uN90+Q+yqP8Ap0v33/6HpJLhn/u/LOuHUfwQYn36f7zfoFzh23k7/bKSSf2Abg9Kn79T6YZUFb36fkP9pySS6IfcyMvtQTT/ALip/wB37VF3E6s/+NU/0JJLV9z/AD/gx9L99w3hH9zV/wC3T+qZR0H7h+iSSm+5fvwUj0iXhn4PIf7bE7j3vN8x9V1JJH/UGl9hSVvdHn90JQ90ev3SSV30c/uOb73x+iD4j73r911JPDsWfQHW/D5u+yFZquJLpXRzSJMNv+8u/i9P4rqS33D2RENHfrcKw4l7lL9w/wCpJJZL2Nj0wNvu/roh9j5rqS1CyEPsVLT90+n3SSWsENq6+n8EM/VcSWxMkOqapmy6kmFZwajzU+J0Hl9yupIfaBdMjCSSSxm+5//Z");


?>