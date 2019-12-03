
module.exports = function (pool) {


  async function getAllWaiters(name) {

    let waiters = await pool.query('select * from  waiter where waiter_name = $1', [name])
    if (waiters.rows.length === 0) {
      await pool.query('insert into waiter (waiter_name)values($1)', [name])
    }
    return waiters.rows
  }

  async function shiftDays() {
    const weekday = await pool.query('select * from daystable')
    return weekday.rows
  }

  async function selectedWorkdays(day) {
    const data = [day.weekday_id, day.waiter_id];
    const sql = `INSERT INTO roster(weekday_id, waiter_id) VALUES($1, $2)`;
    return await pool.query(sql, data);
  }

  async function getdaybyDays(days) {
    const sql = `select * from daystable where weekdays ='${days}'`
    let results = await pool.query(sql)
    results = results.rows[0].id;
    return results
  }
  async function getwaitersbyName(name) {
    const sql = `select * from waiter where waiter_name ='${name}'`
    let result = await pool.query(sql)
    result = result.rows[0].id;
    return result

  }
  async function countwaiter(){
    let counterdays = await pool.query('SELECT COUNT(*) from waiter');
    return counterdays.rows[0].count;
  }

  async function adminTable(day){
 
  }





  return {
    getAllWaiters,
    shiftDays,
    selectedWorkdays,
    getdaybyDays,
    getwaitersbyName,
    countwaiter,
    adminTable

  }

}