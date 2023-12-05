from pyteal import *

def profile_smart_contract():
    # Define state keys
    fullname_key = Bytes("fullname")
    username_key = Bytes("username")
    gender_key = Bytes("gender")
    bio_key = Bytes("bio")

    # Define transactions
    @Subroutine(TealType.uint64)
    def create_update_profile(fullname: Expr, username: Expr, gender: Expr, bio: Expr):
        return Seq([
            App.localPut(Int(0), fullname_key, fullname),
            App.localPut(Int(0), username_key, username),
            App.localPut(Int(0), gender_key, gender),
            App.localPut(Int(0), bio_key, bio),
            Int(1)
        ])

    # Main program logic
    program = Cond(
        [Txn.application_id() == Int(0), Return(Int(1))],  # Creation
        [Txn.on_completion() == OnComplete.NoOp, Return(create_update_profile(
            Txn.application_args[0],  # fullname
            Txn.application_args[1],  # username
            Txn.application_args[2],  # gender
            Txn.application_args[3]   # bio
        ))],
        [Txn.on_completion() == OnComplete.OptIn, Return(Int(1))],  # Handle opt-in
        [Int(1), Return(Int(0))]  # Default case, return 0 for failure
    )

    return program

def clear_state_program():
    return Return(Int(1))

if __name__ == "__main__":
    with open("approval_program.teal", "w") as f:
        compiled_approval_program = compileTeal(profile_smart_contract(), mode=Mode.Application, version=4)
        f.write(compiled_approval_program)

    with open("clear_state_program.teal", "w") as f:
        compiled_clear_state_program = compileTeal(clear_state_program(), mode=Mode.Application, version=4)
        f.write(compiled_clear_state_program)