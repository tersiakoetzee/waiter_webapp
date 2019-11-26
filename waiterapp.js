
module.exports = function (pool) {


  async function getAllWaiters(name) {

    let waiters = await pool.query('select * from  waiter where waiter_name = $1', [name])

    if (waiters.rows.length === 0) {
      await pool.query('insert into waiter (waiter_name)values($1)', [name])
    }
    return waiters.rows

  }
  async function shiftDays(day) {
    var selectedDays = []
  }



  return {
    getAllWaiters,
    shiftDays,

  }

}