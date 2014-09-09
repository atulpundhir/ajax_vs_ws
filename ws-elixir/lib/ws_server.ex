defmodule WebSocketServer do
  @behaviour :application

  def start(_type, _args) do
    File.rm('priv/data/ajax.csv') 
    File.rm('priv/data/ws.csv') 
    {:ok, file} = File.open "priv/data/ajax.csv", [:write]    
    IO.binwrite file, "Id,Time\n" 
    dispatch = :cowboy_router.compile([
      {:_, [
        {'/', HelloHandler,  [file]},  
        {'/ws',  WebSocketHandler, []},
        # {'/_ws', WebSocketHandler, [{:dumb_protocol,   DumbIncrementHandler},
            #                            {:mirror_protocol, MirrorHandler}]},
        {'/public/[...]', :cowboy_static, {:dir, "priv/public/"}},
        {'/data/[...]', :cowboy_static, {:dir, "priv/data/"}},
        {'/client/[...]', :cowboy_static, {:dir, "priv/client/"}},
      ]}
    ])
    :cowboy.start_http :my_http_listener, 100, [{:port, 9001}], [{:env, [{:dispatch, dispatch}]}]
    IO.puts "Started listening on port 9001..."


    WebSocketSup.start_link
  end

  def stop(_state) do
    :ok
  end
end
