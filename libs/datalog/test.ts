
loops.forever(function () {
    datalog.addRow()
    datalog.addValue("x", Math.random())
    datalog.addValue("y", Math.random())
})
