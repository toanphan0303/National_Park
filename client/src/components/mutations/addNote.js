import gql from 'graphql-tag';

export default gql`
mutation addNote($pointId: ID!, $title: String, $content: String){
  addNote(pointId: $pointId, title: $title, content: $content){
    note{
      id
      title
      content
    }
  }
}
`
