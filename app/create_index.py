from llama_index.core import SimpleDirectoryReader, GPTVectorStoreIndex

# creating and saving index for smart agent
def create_and_save_index(pdf_path: str, index_path: str):
    # Load PDF and create the index
    documents = SimpleDirectoryReader(input_files=[pdf_path]).load_data()
    index = GPTVectorStoreIndex.from_documents(documents)
    
    # Save the index locally
    index.storage_context.persist(persist_dir=index_path)
    print(f"Index saved at {index_path}")
    

create_and_save_index("./pdfs/progressive_overload.pdf", "./indices/progressive_overload_index")