import Card from "../card/Card";

function List({ posts, setPosts, isOwnerView = false }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
      {posts.map((item) => (
        <Card 
          key={item._id} 
          item={item} 
          setPosts={setPosts}
          isOwnerView={isOwnerView}
        />
      ))}
    </div>
  );
}

export default List;
