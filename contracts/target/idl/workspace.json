{
  "address": "2xZQckqET9bFUnNRSMP8zorsvoRLLJwKDAx5axT11ryP",
  "metadata": {
    "name": "workspace",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "advance_round",
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
                "account": "Circle"
              },
              {
                "kind": "account",
                "path": "circle.circle_id",
                "account": "Circle"
              }
            ]
          }
        },
        {
          "name": "prev_round_state"
        },
        {
          "name": "new_round_state",
          "writable": true
        },
        {
          "name": "caller",
          "writable": true,
          "signer": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "claim_payout",
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
                "account": "Circle"
              },
              {
                "kind": "account",
                "path": "circle.circle_id",
                "account": "Circle"
              }
            ]
          }
        },
        {
          "name": "round_state",
          "writable": true
        },
        {
          "name": "member_record",
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
          "name": "user_reputation",
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
          "name": "circle_vault",
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
                "path": "usdc_mint"
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
          "name": "usdc_mint"
        },
        {
          "name": "recipient_token_account",
          "writable": true
        },
        {
          "name": "recipient",
          "writable": true,
          "signer": true
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "init_user_reputation",
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
          "name": "user_reputation",
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
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initialize_circle",
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
          "name": "global_state",
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
                "account": "GlobalState"
              }
            ]
          }
        },
        {
          "name": "member_record",
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
          "name": "user_reputation",
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
          "name": "usdc_mint"
        },
        {
          "name": "circle_vault",
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
                "path": "usdc_mint"
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
          "name": "creator_token_account",
          "writable": true
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "contribution_amount",
          "type": "u64"
        },
        {
          "name": "security_deposit",
          "type": "u64"
        },
        {
          "name": "max_members",
          "type": "u8"
        },
        {
          "name": "round_duration",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize_config",
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
          "name": "global_state",
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
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "usdc_mint",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "join_circle",
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
                "account": "Circle"
              },
              {
                "kind": "account",
                "path": "circle.circle_id",
                "account": "Circle"
              }
            ]
          }
        },
        {
          "name": "member_record",
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
          "name": "user_reputation",
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
          "name": "round_state",
          "writable": true
        },
        {
          "name": "circle_vault",
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
                "path": "usdc_mint"
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
          "name": "usdc_mint"
        },
        {
          "name": "joiner_token_account",
          "writable": true
        },
        {
          "name": "joiner",
          "writable": true,
          "signer": true
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "mark_default",
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
                "account": "Circle"
              },
              {
                "kind": "account",
                "path": "circle.circle_id",
                "account": "Circle"
              }
            ]
          }
        },
        {
          "name": "defaulter_member_record",
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
          "name": "defaulter_reputation",
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
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "pay_round",
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
                "account": "Circle"
              },
              {
                "kind": "account",
                "path": "circle.circle_id",
                "account": "Circle"
              }
            ]
          }
        },
        {
          "name": "round_state",
          "writable": true
        },
        {
          "name": "payment_record",
          "writable": true
        },
        {
          "name": "member_record",
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
          "name": "user_reputation",
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
          "name": "circle_vault",
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
                "path": "usdc_mint"
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
          "name": "usdc_mint"
        },
        {
          "name": "payer_token_account",
          "writable": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "refund_deposit",
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
                "account": "Circle"
              },
              {
                "kind": "account",
                "path": "circle.circle_id",
                "account": "Circle"
              }
            ]
          }
        },
        {
          "name": "member_record",
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
                "path": "member_wallet"
              }
            ]
          }
        },
        {
          "name": "user_reputation",
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
                "path": "member_wallet"
              }
            ]
          }
        },
        {
          "name": "circle_vault",
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
                "path": "usdc_mint"
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
          "name": "usdc_mint"
        },
        {
          "name": "member_token_account",
          "writable": true
        },
        {
          "name": "member_wallet"
        },
        {
          "name": "caller",
          "writable": true,
          "signer": true
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "Circle",
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
      "name": "GlobalState",
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
      "name": "MemberRecord",
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
      "name": "PaymentRecord",
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
      "name": "RoundState",
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
      "name": "UserReputation",
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
      "name": "InvalidAmount",
      "msg": "Invalid amount provided"
    },
    {
      "code": 6001,
      "name": "InvalidMaxMembers",
      "msg": "Max members must be between 2 and 10"
    },
    {
      "code": 6002,
      "name": "InvalidRoundDuration",
      "msg": "Round duration must be at least 60 seconds"
    },
    {
      "code": 6003,
      "name": "CircleNotOpen",
      "msg": "Circle is not open for joining"
    },
    {
      "code": 6004,
      "name": "CircleFull",
      "msg": "Circle is full"
    },
    {
      "code": 6005,
      "name": "AlreadyJoined",
      "msg": "Already joined this circle"
    },
    {
      "code": 6006,
      "name": "NotAMember",
      "msg": "Not a member of this circle"
    },
    {
      "code": 6007,
      "name": "RoundNotActive",
      "msg": "Round is not active"
    },
    {
      "code": 6008,
      "name": "AlreadyPaid",
      "msg": "Already paid for this round"
    },
    {
      "code": 6009,
      "name": "RecipientCannotPay",
      "msg": "Recipient cannot pay themselves"
    },
    {
      "code": 6010,
      "name": "NotRecipient",
      "msg": "Not the round recipient"
    },
    {
      "code": 6011,
      "name": "RoundNotComplete",
      "msg": "Round is not complete"
    },
    {
      "code": 6012,
      "name": "PayoutAlreadyClaimed",
      "msg": "Payout already claimed"
    },
    {
      "code": 6013,
      "name": "PayoutNotClaimed",
      "msg": "Payout not yet claimed"
    },
    {
      "code": 6014,
      "name": "DeadlineNotPassed",
      "msg": "Deadline has not passed"
    },
    {
      "code": 6015,
      "name": "AlreadyDefaulted",
      "msg": "Already defaulted"
    },
    {
      "code": 6016,
      "name": "CircleNotCompleted",
      "msg": "Circle not completed"
    },
    {
      "code": 6017,
      "name": "NoDepositToRefund",
      "msg": "No deposit to refund"
    },
    {
      "code": 6018,
      "name": "MathOverflow",
      "msg": "Math overflow"
    },
    {
      "code": 6019,
      "name": "InvalidMint",
      "msg": "Invalid mint"
    },
    {
      "code": 6020,
      "name": "Unauthorized",
      "msg": "Unauthorized"
    }
  ],
  "types": [
    {
      "name": "Circle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "circle_id",
            "type": "u64"
          },
          {
            "name": "usdc_mint",
            "type": "pubkey"
          },
          {
            "name": "contribution_amount",
            "type": "u64"
          },
          {
            "name": "security_deposit",
            "type": "u64"
          },
          {
            "name": "max_members",
            "type": "u8"
          },
          {
            "name": "current_members",
            "type": "u8"
          },
          {
            "name": "current_round",
            "type": "u8"
          },
          {
            "name": "total_rounds",
            "type": "u8"
          },
          {
            "name": "round_started_at",
            "type": "i64"
          },
          {
            "name": "round_duration",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "CircleStatus"
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
            "name": "payout_order",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "created_at",
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
      "name": "CircleStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Open"
          },
          {
            "name": "Active"
          },
          {
            "name": "Completed"
          },
          {
            "name": "Cancelled"
          }
        ]
      }
    },
    {
      "name": "GlobalState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "total_circles",
            "type": "u64"
          },
          {
            "name": "usdc_mint",
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
      "name": "MemberRecord",
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
            "name": "deposit_locked",
            "type": "u64"
          },
          {
            "name": "paid_rounds",
            "type": "u8"
          },
          {
            "name": "received_payout",
            "type": "bool"
          },
          {
            "name": "defaulted",
            "type": "bool"
          },
          {
            "name": "joined_at",
            "type": "i64"
          },
          {
            "name": "payout_index",
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
      "name": "PaymentRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "circle",
            "type": "pubkey"
          },
          {
            "name": "round_index",
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
            "name": "paid_at",
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
      "name": "RoundState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "circle",
            "type": "pubkey"
          },
          {
            "name": "round_index",
            "type": "u8"
          },
          {
            "name": "recipient",
            "type": "pubkey"
          },
          {
            "name": "total_collected",
            "type": "u64"
          },
          {
            "name": "payments_count",
            "type": "u8"
          },
          {
            "name": "payout_claimed",
            "type": "bool"
          },
          {
            "name": "started_at",
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
      "name": "UserReputation",
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
            "name": "circles_joined",
            "type": "u32"
          },
          {
            "name": "circles_completed",
            "type": "u32"
          },
          {
            "name": "defaults_count",
            "type": "u32"
          },
          {
            "name": "on_time_payments",
            "type": "u32"
          },
          {
            "name": "late_payments",
            "type": "u32"
          },
          {
            "name": "total_contributed",
            "type": "u64"
          },
          {
            "name": "total_received",
            "type": "u64"
          },
          {
            "name": "created_at",
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
}