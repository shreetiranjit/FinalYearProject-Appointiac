from pyteal import *

def timeslot_smart_contract():
    # Define state keys
    ts1_key = Bytes("ts1")
    ts2_key = Bytes("ts2")
    ts3_key = Bytes("ts3")
    ts4_key = Bytes("ts4")
    ts5_key = Bytes("ts5")
    ts6_key = Bytes("ts6")
    ts7_key = Bytes("ts7")
    ts8_key = Bytes("ts8")
    ts9_key = Bytes("ts9")
    ts10_key = Bytes("ts10")
    ts11_key = Bytes("ts11")
    ts12_key = Bytes("ts12")
    ts13_key = Bytes("ts13")
    ts14_key = Bytes("ts14")

    # Define a single transaction function that updates all 14 keys
    @Subroutine(TealType.uint64)
    def create_update_timeslot(
        ts1: Expr, ts2: Expr, ts3: Expr, ts4: Expr, ts5: Expr, ts6: Expr,
        ts7: Expr, ts8: Expr, ts9: Expr, ts10: Expr, ts11: Expr, ts12: Expr,
        ts13: Expr, ts14: Expr
    ):
        return Seq([
            App.localPut(Int(0), ts1_key, ts1),
            App.localPut(Int(0), ts2_key, ts2),
            App.localPut(Int(0), ts3_key, ts3),
            App.localPut(Int(0), ts4_key, ts4),
            App.localPut(Int(0), ts5_key, ts5),
            App.localPut(Int(0), ts6_key, ts6),
            App.localPut(Int(0), ts7_key, ts7),
            App.localPut(Int(0), ts8_key, ts8),
            App.localPut(Int(0), ts9_key, ts9),
            App.localPut(Int(0), ts10_key, ts10),
            App.localPut(Int(0), ts11_key, ts11),
            App.localPut(Int(0), ts12_key, ts12),
            App.localPut(Int(0), ts13_key, ts13),
            App.localPut(Int(0), ts14_key, ts14),
            Int(1)
        ])

    # Main program logic
    program = Cond(
        [Txn.application_id() == Int(0), Return(Int(1))],  # Creation
        [Txn.on_completion() == OnComplete.NoOp, Return(create_update_timeslot(
            Txn.application_args[0],
            Txn.application_args[1],
            Txn.application_args[2],
            Txn.application_args[3],
            Txn.application_args[4],
            Txn.application_args[5],
            Txn.application_args[6],
            Txn.application_args[7],
            Txn.application_args[8],
            Txn.application_args[9],
            Txn.application_args[10],
            Txn.application_args[11],
            Txn.application_args[12],
            Txn.application_args[13]
        ))],
        [Txn.on_completion() == OnComplete.OptIn, Return(Int(1))],  # Handle opt-in
        [Int(1), Return(Int(0))]  # Default case, return 0 for failure
    )

    return program

def clear_state_program():
    return Return(Int(1))

if __name__ == "__main__":
    with open("timeslot_approval_program.teal", "w") as f:
        compiled_approval_program = compileTeal(timeslot_smart_contract(), mode=Mode.Application, version=4)
        f.write(compiled_approval_program)

    with open("timeslot_clear_state_program.teal", "w") as f:
        compiled_clear_state_program = compileTeal(clear_state_program(), mode=Mode.Application, version=4)
        f.write(compiled_clear_state_program)