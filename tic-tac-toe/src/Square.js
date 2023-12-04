function Square(properties) {
    return (
        <button className="square" onClick={() => properties.onClick()}>
            {properties.value}
        </button>
    );
}
export default Square;