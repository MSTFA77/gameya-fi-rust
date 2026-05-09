/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/workspace.json`.
 */
export type Workspace = {
  "address": "2xZQckqET9bFUnNRSMP8zorsvoRLLJwKDAx5axT11ryP",
  "metadata": {
    "name": "workspace",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "advanceRound",
      "discriminator": [
        230,
        88,
        119,
        80,
        54,
        4,
        212,
        250
      ],
      "accounts": [
        {
          "name": "circle",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  105,
                  114,
                  99,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "circle.authority",
                "account": "circle"
              },
              {
                "kind": "account",
                "path": "circle.circle_id",
                "account": "circle"
              }
            ]
          }
        },
        {
          "name": "prevRoundState"
        },
        {
          "name": "newRoundState",
          "writable": true
        },
        {
          "name": "caller",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "claimPayout",
      "discriminator": [
        127,
        240,
        132,
        62,
        227,
        198,
        146,
        133
      ],
      "accounts": [
        {
          "name": "circle",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  105,
                  114,
                  99,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "circle.authority",
                "account": "circle"
              },
              {
                "kind": "account",
                "path": "circle.circle_id",
                "account": "circle"
              }
            ]
          }
        },
        {
          "name": "roundState",
          "writable": true
        },
        {
          "name": "memberRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  109,
                  98,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "circle"
              },
              {
                "kind": "account",
                "path": "recipient"
              }
            ]
          }
        },
        {
          "name": "userReputation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  112,
                  117,
                  116,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "recipient"
              }
            ]
          }
        },
        {
          "name": "circleVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "circle"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "recipientTokenAccount",
          "writable": true
        },
        {
          "name": "recipient",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "initUserReputation",
      "discriminator": [
        148,
        72,
        196,
        80,
        51,
        176,
        203,
        116
      ],
      "accounts": [
        {
          "name": "userReputation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  112,
                  117,
                  116,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeCircle",
      "discriminator": [
        165,
        209,
        84,
        125,
        187,
        103,
        98,
        90
      ],
      "accounts": [
        {
          "name": "globalState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "circle",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  105,
                  114,
                  99,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "account",
                "path": "global_state.total_circles",
                "account": "globalState"
              }
            ]
          }
        },
        {
          "name": "memberRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  109,
                  98,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "circle"
              },
              {
                "kind": "account",
                "path": "creator"
              }
            ]
          }
        },
        {
          "name": "userReputation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  112,
                  117,
                  116,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              }
            ]
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "circleVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "circle"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "creatorTokenAccount",
          "writable": true
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "contributionAmount",
          "type": "u64"
        },
        {
          "name": "securityDeposit",
          "type": "u64"
        },
        {
          "name": "maxMembers",
          "type": "u8"
        },
        {
          "name": "roundDuration",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeConfig",
      "discriminator": [
        208,
        127,
        21,
        1,
        194,
        190,
        196,
        70
      ],
      "accounts": [
        {
          "name": "globalState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "usdcMint",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "joinCircle",
      "discriminator": [
        231,
        168,
        235,
        18,
        99,
        12,
        22,
        7
      ],
      "accounts": [
        {
          "name": "circle",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  105,
                  114,
                  99,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "circle.authority",
                "account": "circle"
              },
              {
                "kind": "account",
                "path": "circle.circle_id",
                "account": "circle"
              }
            ]
          }
        },
        {
          "name": "memberRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  109,
                  98,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "circle"
              },
              {
                "kind": "account",
                "path": "joiner"
              }
            ]
          }
        },
        {
          "name": "userReputation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  112,
                  117,
                  116,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "joiner"
              }
            ]
          }
        },
        {
          "name": "roundState",
          "writable": true
        },
        {
          "name": "circleVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "circle"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "joinerTokenAccount",
          "writable": true
        },
        {
          "name": "joiner",
          "writable": true,
          "signer": true
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "markDefault",
      "discriminator": [
        182,
        231,
        123,
        132,
        66,
        208,
        137,
        139
      ],
      "accounts": [
        {
          "name": "circle",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  105,
                  114,
                  99,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "circle.authority",
                "account": "circle"
              },
              {
                "kind": "account",
                "path": "circle.circle_id",
                "account": "circle"
              }
            ]
          }
        },
        {
          "name": "defaulterMemberRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  109,
                  98,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "circle"
              },
              {
                "kind": "account",
                "path": "defaulter"
              }
            ]
          }
        },
        {
          "name": "defaulterReputation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  112,
                  117,
                  116,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "defaulter"
              }
            ]
          }
        },
        {
          "name": "defaulter"
        },
        {
          "name": "caller",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "payRound",
      "discriminator": [
        88,
        109,
        196,
        46,
        199,
        222,
        90,
        98
      ],
      "accounts": [
        {
          "name": "circle",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  105,
                  114,
                  99,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "circle.authority",
                "account": "circle"
              },
              {
                "kind": "account",
                "path": "circle.circle_id",
                "account": "circle"
              }
            ]
          }
        },
        {
          "name": "roundState",
          "writable": true
        },
        {
          "name": "paymentRecord",
          "writable": true
        },
        {
          "name": "memberRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  109,
                  98,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "circle"
              },
              {
                "kind": "account",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "userReputation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  112,
                  117,
                  116,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "circleVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "circle"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "payerTokenAccount",
          "writable": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "refundDeposit",
      "discriminator": [
        19,
        19,
        78,
        50,
        187,
        10,
        162,
        229
      ],
      "accounts": [
        {
          "name": "circle",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  105,
                  114,
                  99,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "circle.authority",
                "account": "circle"
              },
              {
                "kind": "account",
                "path": "circle.circle_id",
                "account": "circle"
              }
            ]
          }
        },
        {
          "name": "memberRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  109,
                  98,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "circle"
              },
              {
                "kind": "account",
                "path": "memberWallet"
              }
            ]
          }
        },
        {
          "name": "userReputation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  112,
                  117,
                  116,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "memberWallet"
              }
            ]
          }
        },
        {
          "name": "circleVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "circle"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "memberTokenAccount",
          "writable": true
        },
        {
          "name": "memberWallet"
        },
        {
          "name": "caller",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "circle",
      "discriminator": [
        27,
        59,
        8,
        117,
        62,
        199,
        222,
        252
      ]
    },
    {
      "name": "globalState",
      "discriminator": [
        163,
        46,
        74,
        168,
        216,
        123,
        133,
        98
      ]
    },
    {
      "name": "memberRecord",
      "discriminator": [
        26,
        35,
        161,
        83,
        248,
        8,
        189,
        249
      ]
    },
    {
      "name": "paymentRecord",
      "discriminator": [
        202,
        168,
        56,
        249,
        127,
        226,
        86,
        226
      ]
    },
    {
      "name": "roundState",
      "discriminator": [
        153,
        242,
        39,
        64,
        102,
        34,
        239,
        11
      ]
    },
    {
      "name": "userReputation",
      "discriminator": [
        86,
        95,
        94,
        218,
        215,
        219,
        207,
        37
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidAmount",
      "msg": "Invalid amount provided"
    },
    {
      "code": 6001,
      "name": "invalidMaxMembers",
      "msg": "Max members must be between 2 and 10"
    },
    {
      "code": 6002,
      "name": "invalidRoundDuration",
      "msg": "Round duration must be at least 60 seconds"
    },
    {
      "code": 6003,
      "name": "circleNotOpen",
      "msg": "Circle is not open for joining"
    },
    {
      "code": 6004,
      "name": "circleFull",
      "msg": "Circle is full"
    },
    {
      "code": 6005,
      "name": "alreadyJoined",
      "msg": "Already joined this circle"
    },
    {
      "code": 6006,
      "name": "notAMember",
      "msg": "Not a member of this circle"
    },
    {
      "code": 6007,
      "name": "roundNotActive",
      "msg": "Round is not active"
    },
    {
      "code": 6008,
      "name": "alreadyPaid",
      "msg": "Already paid for this round"
    },
    {
      "code": 6009,
      "name": "recipientCannotPay",
      "msg": "Recipient cannot pay themselves"
    },
    {
      "code": 6010,
      "name": "notRecipient",
      "msg": "Not the round recipient"
    },
    {
      "code": 6011,
      "name": "roundNotComplete",
      "msg": "Round is not complete"
    },
    {
      "code": 6012,
      "name": "payoutAlreadyClaimed",
      "msg": "Payout already claimed"
    },
    {
      "code": 6013,
      "name": "payoutNotClaimed",
      "msg": "Payout not yet claimed"
    },
    {
      "code": 6014,
      "name": "deadlineNotPassed",
      "msg": "Deadline has not passed"
    },
    {
      "code": 6015,
      "name": "alreadyDefaulted",
      "msg": "Already defaulted"
    },
    {
      "code": 6016,
      "name": "circleNotCompleted",
      "msg": "Circle not completed"
    },
    {
      "code": 6017,
      "name": "noDepositToRefund",
      "msg": "No deposit to refund"
    },
    {
      "code": 6018,
      "name": "mathOverflow",
      "msg": "Math overflow"
    },
    {
      "code": 6019,
      "name": "invalidMint",
      "msg": "Invalid mint"
    },
    {
      "code": 6020,
      "name": "unauthorized",
      "msg": "unauthorized"
    }
  ],
  "types": [
    {
      "name": "circle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "circleId",
            "type": "u64"
          },
          {
            "name": "usdcMint",
            "type": "pubkey"
          },
          {
            "name": "contributionAmount",
            "type": "u64"
          },
          {
            "name": "securityDeposit",
            "type": "u64"
          },
          {
            "name": "maxMembers",
            "type": "u8"
          },
          {
            "name": "currentMembers",
            "type": "u8"
          },
          {
            "name": "currentRound",
            "type": "u8"
          },
          {
            "name": "totalRounds",
            "type": "u8"
          },
          {
            "name": "roundStartedAt",
            "type": "i64"
          },
          {
            "name": "roundDuration",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "circleStatus"
              }
            }
          },
          {
            "name": "members",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "payoutOrder",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "circleStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "open"
          },
          {
            "name": "active"
          },
          {
            "name": "completed"
          },
          {
            "name": "cancelled"
          }
        ]
      }
    },
    {
      "name": "globalState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "totalCircles",
            "type": "u64"
          },
          {
            "name": "usdcMint",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "memberRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "circle",
            "type": "pubkey"
          },
          {
            "name": "member",
            "type": "pubkey"
          },
          {
            "name": "depositLocked",
            "type": "u64"
          },
          {
            "name": "paidRounds",
            "type": "u8"
          },
          {
            "name": "receivedPayout",
            "type": "bool"
          },
          {
            "name": "defaulted",
            "type": "bool"
          },
          {
            "name": "joinedAt",
            "type": "i64"
          },
          {
            "name": "payoutIndex",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "paymentRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "circle",
            "type": "pubkey"
          },
          {
            "name": "roundIndex",
            "type": "u8"
          },
          {
            "name": "payer",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "paidAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "roundState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "circle",
            "type": "pubkey"
          },
          {
            "name": "roundIndex",
            "type": "u8"
          },
          {
            "name": "recipient",
            "type": "pubkey"
          },
          {
            "name": "totalCollected",
            "type": "u64"
          },
          {
            "name": "paymentsCount",
            "type": "u8"
          },
          {
            "name": "payoutClaimed",
            "type": "bool"
          },
          {
            "name": "startedAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "userReputation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "score",
            "type": "u64"
          },
          {
            "name": "circlesJoined",
            "type": "u32"
          },
          {
            "name": "circlesCompleted",
            "type": "u32"
          },
          {
            "name": "defaultsCount",
            "type": "u32"
          },
          {
            "name": "onTimePayments",
            "type": "u32"
          },
          {
            "name": "latePayments",
            "type": "u32"
          },
          {
            "name": "totalContributed",
            "type": "u64"
          },
          {
            "name": "totalReceived",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
