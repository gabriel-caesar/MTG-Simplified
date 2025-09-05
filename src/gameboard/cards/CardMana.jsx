// function to display in the UI the amount of mana cost for cards
export default function CardMana({ mana_cost }) {
  return (
    <>
      {mana_cost.includes('{1}') && (
        <i class='ms ms-1 ms-cost ms-shadow'></i> // mana icon
      )}
      {mana_cost.includes('{2}') && (
        <i class='ms ms-2 ms-cost ms-shadow'></i> // mana icon
      )}
      {mana_cost.includes('{3}') && (
        <i class='ms ms-3 ms-cost ms-shadow'></i> // mana icon
      )}
      {mana_cost.includes('{6}') && (
        <i class='ms ms-6 ms-cost ms-shadow'></i> // mana icon
      )}
      {mana_cost.includes('{W}{W}') ? ( // mana icon
        <>
          <i class='ms ms-w ms-cost ms-shadow'></i>
          <i class='ms ms-w ms-cost ms-shadow'></i>
        </>
      ) : mana_cost.includes('{W}') ? ( // mana icon
        <>
          <i class='ms ms-w ms-cost ms-shadow'></i>
        </>
      ) : mana_cost.includes('{B}{B}') ? ( // mana icon
        <>
          <i class='ms ms-b ms-cost ms-shadow'></i>
          <i class='ms ms-b ms-cost ms-shadow'></i>
        </>
      ) : (
        mana_cost.includes('{B}') && <i class='ms ms-b ms-cost ms-shadow'></i> // mana icon
      )}
    </>
  );
}